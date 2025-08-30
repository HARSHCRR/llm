import * as tf from '@tensorflow/tfjs';

export interface ModelConfig {
  vocabSize: number;
  maxLength: number;
  hiddenSize: number;
  numLayers: number;
  numHeads: number;
  intermediateSize: number;
  dropout: number;
}

export interface SummaryOutput {
  patientSummary: string;
  clinicianSummary: string;
  attentionWeights: number[][];
  confidence: number;
}

export class DualDecoderTransformer {
  private model: tf.LayersModel | null = null;
  private tokenizer: any = null;
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  // Initialize the dual-decoder transformer architecture
  async initialize(): Promise<void> {
    try {
      // Create the model architecture
      this.model = this.buildModel();
      
      // Initialize with random weights for demo
      // In production, you would load pre-trained weights
      await this.loadWeights();
      
      console.log('Dual-decoder transformer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize model:', error);
      throw error;
    }
  }

  private buildModel(): tf.LayersModel {
    // Input layer for medical text
    const inputIds = tf.input({ 
      shape: [this.config.maxLength], 
      name: 'input_ids',
      dtype: 'int32'
    });

    // Embedding layer
    const embedding = tf.layers.embedding({
      inputDim: this.config.vocabSize,
      outputDim: this.config.hiddenSize,
      maskZero: true,
      name: 'embedding'
    }).apply(inputIds) as tf.SymbolicTensor;

    // Positional encoding
    const positionEmbedding = tf.layers.embedding({
      inputDim: this.config.maxLength,
      outputDim: this.config.hiddenSize,
      name: 'position_embedding'
    });

    // Create position indices
    const positions = tf.range(0, this.config.maxLength);
    const posEmbedded = positionEmbedding.apply(positions) as tf.SymbolicTensor;

    // Add embeddings
    const embeddings = tf.layers.add({ name: 'embeddings_sum' })
      .apply([embedding, posEmbedded]) as tf.SymbolicTensor;

    // Encoder layers
    let encoderOutput = embeddings;
    for (let i = 0; i < this.config.numLayers; i++) {
      encoderOutput = this.buildEncoderLayer(encoderOutput, `encoder_layer_${i}`);
    }

    // Patient decoder branch
    const patientDecoder = this.buildDecoderBranch(
      encoderOutput, 
      'patient_decoder',
      'patient-friendly'
    );

    // Clinician decoder branch
    const clinicianDecoder = this.buildDecoderBranch(
      encoderOutput, 
      'clinician_decoder',
      'clinician-focused'
    );

    // Cross-attention between decoders
    const crossAttention = this.buildCrossAttention(
      patientDecoder, 
      clinicianDecoder, 
      'cross_attention'
    );

    // Output projections
    const patientOutput = tf.layers.dense({
      units: this.config.vocabSize,
      activation: 'softmax',
      name: 'patient_output'
    }).apply(crossAttention.patient) as tf.SymbolicTensor;

    const clinicianOutput = tf.layers.dense({
      units: this.config.vocabSize,
      activation: 'softmax',
      name: 'clinician_output'
    }).apply(crossAttention.clinician) as tf.SymbolicTensor;

    // Create the model
    const model = tf.model({
      inputs: inputIds,
      outputs: [patientOutput, clinicianOutput],
      name: 'dual_decoder_transformer'
    });

    return model;
  }

  private buildEncoderLayer(input: tf.SymbolicTensor, name: string): tf.SymbolicTensor {
    // Multi-head self-attention
    const attention = tf.layers.multiHeadAttention({
      numHeads: this.config.numHeads,
      keyDim: this.config.hiddenSize / this.config.numHeads,
      dropout: this.config.dropout,
      name: `${name}_attention`
    }).apply([input, input]) as tf.SymbolicTensor;

    // Add & Norm
    const norm1 = tf.layers.layerNormalization({ name: `${name}_norm1` })
      .apply(tf.layers.add().apply([input, attention])) as tf.SymbolicTensor;

    // Feed forward
    const ff1 = tf.layers.dense({
      units: this.config.intermediateSize,
      activation: 'relu',
      name: `${name}_ff1`
    }).apply(norm1) as tf.SymbolicTensor;

    const ff2 = tf.layers.dense({
      units: this.config.hiddenSize,
      name: `${name}_ff2`
    }).apply(ff1) as tf.SymbolicTensor;

    // Add & Norm
    const output = tf.layers.layerNormalization({ name: `${name}_norm2` })
      .apply(tf.layers.add().apply([norm1, ff2])) as tf.SymbolicTensor;

    return output;
  }

  private buildDecoderBranch(
    encoderOutput: tf.SymbolicTensor, 
    name: string, 
    type: string
  ): tf.SymbolicTensor {
    // Decoder-specific processing
    let decoderOutput = encoderOutput;

    for (let i = 0; i < 2; i++) {
      // Self-attention
      const selfAttention = tf.layers.multiHeadAttention({
        numHeads: this.config.numHeads,
        keyDim: this.config.hiddenSize / this.config.numHeads,
        dropout: this.config.dropout,
        name: `${name}_self_attention_${i}`
      }).apply([decoderOutput, decoderOutput]) as tf.SymbolicTensor;

      // Cross-attention with encoder
      const crossAttention = tf.layers.multiHeadAttention({
        numHeads: this.config.numHeads,
        keyDim: this.config.hiddenSize / this.config.numHeads,
        dropout: this.config.dropout,
        name: `${name}_cross_attention_${i}`
      }).apply([selfAttention, encoderOutput]) as tf.SymbolicTensor;

      // Feed forward
      const ff = tf.layers.dense({
        units: this.config.intermediateSize,
        activation: 'relu',
        name: `${name}_ff_${i}`
      }).apply(crossAttention) as tf.SymbolicTensor;

      decoderOutput = tf.layers.dense({
        units: this.config.hiddenSize,
        name: `${name}_projection_${i}`
      }).apply(ff) as tf.SymbolicTensor;

      // Layer normalization
      decoderOutput = tf.layers.layerNormalization({ 
        name: `${name}_norm_${i}` 
      }).apply(decoderOutput) as tf.SymbolicTensor;
    }

    return decoderOutput;
  }

  private buildCrossAttention(
    patientDecoder: tf.SymbolicTensor,
    clinicianDecoder: tf.SymbolicTensor,
    name: string
  ): { patient: tf.SymbolicTensor; clinician: tf.SymbolicTensor } {
    // Patient attends to clinician
    const patientToClinician = tf.layers.multiHeadAttention({
      numHeads: this.config.numHeads,
      keyDim: this.config.hiddenSize / this.config.numHeads,
      name: `${name}_patient_to_clinician`
    }).apply([patientDecoder, clinicianDecoder]) as tf.SymbolicTensor;

    // Clinician attends to patient
    const clinicianToPatient = tf.layers.multiHeadAttention({
      numHeads: this.config.numHeads,
      keyDim: this.config.hiddenSize / this.config.numHeads,
      name: `${name}_clinician_to_patient`
    }).apply([clinicianDecoder, patientDecoder]) as tf.SymbolicTensor;

    // Combine with residual connections
    const patientOutput = tf.layers.add({ name: `${name}_patient_add` })
      .apply([patientDecoder, patientToClinician]) as tf.SymbolicTensor;

    const clinicianOutput = tf.layers.add({ name: `${name}_clinician_add` })
      .apply([clinicianDecoder, clinicianToPatient]) as tf.SymbolicTensor;

    return {
      patient: patientOutput,
      clinician: clinicianOutput
    };
  }

  private async loadWeights(): Promise<void> {
    // In a real implementation, you would load pre-trained weights
    // For demo purposes, we'll use random initialization
    if (this.model) {
      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: ['sparseCategoricalCrossentropy', 'sparseCategoricalCrossentropy'],
        metrics: ['accuracy']
      });
    }
  }

  // Simulate medical text processing
  async generateSummaries(medicalText: string): Promise<SummaryOutput> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    try {
      // Simulate tokenization (in real implementation, use proper tokenizer)
      const tokens = this.tokenizeText(medicalText);
      const inputTensor = tf.tensor2d([tokens], [1, tokens.length]);

      // Run inference
      const predictions = this.model.predict(inputTensor) as tf.Tensor[];
      
      // Generate summaries (simplified for demo)
      const patientSummary = this.generatePatientSummary(medicalText);
      const clinicianSummary = this.generateClinicianSummary(medicalText);

      // Simulate attention weights
      const attentionWeights = this.generateAttentionWeights();

      // Cleanup tensors
      inputTensor.dispose();
      predictions.forEach(tensor => tensor.dispose());

      return {
        patientSummary,
        clinicianSummary,
        attentionWeights,
        confidence: 0.85 + Math.random() * 0.1 // Simulate confidence
      };
    } catch (error) {
      console.error('Error generating summaries:', error);
      throw error;
    }
  }

  private tokenizeText(text: string): number[] {
    // Simplified tokenization for demo
    const words = text.toLowerCase().split(/\s+/);
    const tokens = words.map(word => {
      // Simple hash-based token generation
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        const char = word.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash) % this.config.vocabSize;
    });

    // Pad or truncate to maxLength
    if (tokens.length > this.config.maxLength) {
      return tokens.slice(0, this.config.maxLength);
    } else {
      return [...tokens, ...Array(this.config.maxLength - tokens.length).fill(0)];
    }
  }

  private generatePatientSummary(medicalText: string): string {
    // Simplified patient-friendly summary generation
    const templates = [
      "Your test results show some areas that need attention. The doctor found signs that suggest your body might need some extra care.",
      "The medical examination revealed some findings that your healthcare team wants to monitor closely.",
      "Your health assessment indicates some changes that require follow-up with your doctor.",
    ];

    const conditions = this.extractConditions(medicalText);
    let summary = templates[Math.floor(Math.random() * templates.length)];

    if (conditions.length > 0) {
      summary += ` The main areas of concern include ${conditions.join(', ')}. Your doctor will explain what this means for your health and discuss the next steps in your care.`;
    }

    summary += " It's important to follow up with your healthcare provider to discuss these findings and create a plan that's right for you.";

    return summary;
  }

  private generateClinicianSummary(medicalText: string): string {
    // Simplified clinician-focused summary generation
    const conditions = this.extractConditions(medicalText);
    const vitals = this.extractVitals(medicalText);

    let summary = "Clinical Assessment Summary:\n\n";

    if (conditions.length > 0) {
      summary += `Primary Findings: ${conditions.join(', ')}\n`;
    }

    if (vitals.length > 0) {
      summary += `Vital Signs/Labs: ${vitals.join(', ')}\n`;
    }

    summary += "\nRecommendations:\n";
    summary += "• Continue monitoring patient status\n";
    summary += "• Consider additional diagnostic workup if symptoms persist\n";
    summary += "• Schedule follow-up appointment in 2-4 weeks\n";
    summary += "• Patient education regarding condition management\n";

    return summary;
  }

  private extractConditions(text: string): string[] {
    const medicalTerms = [
      'hypertension', 'diabetes', 'chest pain', 'shortness of breath',
      'elevated troponin', 'infection', 'inflammation', 'fatigue'
    ];

    return medicalTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
  }

  private extractVitals(text: string): string[] {
    const vitalPatterns = [
      /blood pressure[:\s]*(\d+\/\d+)/i,
      /heart rate[:\s]*(\d+)/i,
      /temperature[:\s]*(\d+\.?\d*)/i,
      /troponin[:\s]*(\d+\.?\d*)/i
    ];

    const vitals: string[] = [];
    vitalPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        vitals.push(match[0]);
      }
    });

    return vitals;
  }

  private generateAttentionWeights(): number[][] {
    // Generate mock attention weights for visualization
    const size = 12;
    const weights: number[][] = [];
    
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        // Create some pattern in attention weights
        const distance = Math.abs(i - j);
        const weight = Math.exp(-distance * 0.3) + Math.random() * 0.2;
        row.push(weight);
      }
      weights.push(row);
    }

    return weights;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}
