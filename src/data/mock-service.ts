export interface SummaryData {
  patientSummary: string;
  clinicianSummary: string;
  provenance: Array<{
    id: string;
    text: string;
    source: string;
    confidence: number;
    position: { start: number; end: number };
  }>;
}

export class MockMedicalService {
  static async generateSummaries(medicalText: string): Promise<SummaryData> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const patientSummary = this.generatePatientSummary(medicalText);
    const clinicianSummary = this.generateClinicianSummary(medicalText);
    const provenance = this.generateProvenance(medicalText);

    return {
      patientSummary,
      clinicianSummary,
      provenance
    };
  }

  private static generatePatientSummary(text: string): string {
    const conditions = this.extractConditions(text);
    
    let summary = "Your recent medical evaluation shows some important findings that your healthcare team wants to discuss with you.\n\n";
    
    if (conditions.includes('chest pain')) {
      summary += "You mentioned experiencing chest discomfort. This is something we take seriously and want to investigate further to make sure your heart is healthy.\n\n";
    }
    
    if (conditions.includes('elevated troponin')) {
      summary += "Your blood tests show elevated levels of a protein called troponin, which can indicate that your heart muscle has been under stress.\n\n";
    }
    
    if (conditions.includes('diabetes')) {
      summary += "Your diabetes management is an important part of your overall health. We'll work together to keep your blood sugar levels in a healthy range.\n\n";
    }
    
    if (conditions.includes('hypertension')) {
      summary += "Your blood pressure readings are higher than we'd like to see. This is manageable with the right treatment plan.\n\n";
    }
    
    summary += "What this means for you:\n";
    summary += "• Your doctor will explain these findings in detail during your visit\n";
    summary += "• We may recommend some additional tests to get a complete picture\n";
    summary += "• There are effective treatments available to help manage your condition\n";
    summary += "• Following your treatment plan will help improve your health outcomes\n\n";
    summary += "Remember: Having these findings doesn't mean you can't live a full, healthy life. Many people successfully manage similar conditions with proper care and lifestyle adjustments.";
    
    return summary;
  }

  private static generateClinicianSummary(text: string): string {
    const conditions = this.extractConditions(text);
    const vitals = this.extractVitals(text);
    
    let summary = "CLINICAL ASSESSMENT SUMMARY\n\n";
    
    summary += "CHIEF COMPLAINT & HISTORY:\n";
    if (conditions.includes('chest pain')) {
      summary += "• Patient presents with chest pain, requires cardiac workup\n";
    }
    if (conditions.includes('shortness of breath')) {
      summary += "• Dyspnea noted, consider cardiopulmonary etiology\n";
    }
    
    summary += "\nLABORATORY/DIAGNOSTIC FINDINGS:\n";
    if (conditions.includes('elevated troponin')) {
      summary += "• Troponin elevation suggests myocardial injury - recommend serial monitoring\n";
    }
    if (vitals.length > 0) {
      summary += `• Vital signs: ${vitals.join(', ')}\n`;
    }
    
    summary += "\nCOMORBIDITIES:\n";
    if (conditions.includes('diabetes')) {
      summary += "• Diabetes mellitus - ensure optimal glycemic control\n";
    }
    if (conditions.includes('hypertension')) {
      summary += "• Hypertension - monitor BP, adjust antihypertensive therapy as needed\n";
    }
    
    summary += "\nCLINICAL RECOMMENDATIONS:\n";
    summary += "• Continue cardiac monitoring and serial troponin levels\n";
    summary += "• Consider echocardiogram and stress testing if indicated\n";
    summary += "• Optimize medical therapy for comorbid conditions\n";
    summary += "• Patient education regarding symptoms requiring immediate attention\n";
    summary += "• Follow-up in cardiology clinic within 1-2 weeks\n";
    summary += "• Discharge planning with appropriate medications and instructions\n\n";
    
    summary += "DISPOSITION: Stable for discharge with close outpatient follow-up";
    
    return summary;
  }

  private static generateProvenance(text: string): Array<{
    id: string;
    text: string;
    source: string;
    confidence: number;
    position: { start: number; end: number };
  }> {
    const provenance: Array<{
      id: string;
      text: string;
      source: string;
      confidence: number;
      position: { start: number; end: number };
    }> = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      if (sentence.toLowerCase().includes('chest pain') || 
          sentence.toLowerCase().includes('troponin') ||
          sentence.toLowerCase().includes('diabetes') ||
          sentence.toLowerCase().includes('hypertension')) {
        
        const start = text.indexOf(sentence.trim());
        const end = start + sentence.trim().length;
        
        provenance.push({
          id: `prov_${index}`,
          text: sentence.trim(),
          source: `Clinical Note Section ${index + 1}`,
          confidence: 0.75 + Math.random() * 0.2,
          position: { start, end }
        });
      }
    });
    
    return provenance;
  }

  private static extractConditions(text: string): string[] {
    const medicalTerms = [
      'chest pain', 'shortness of breath', 'elevated troponin', 
      'diabetes', 'hypertension', 'fatigue', 'infection'
    ];

    return medicalTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
  }

  private static extractVitals(text: string): string[] {
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
}

export const sampleMedicalTexts = [
  {
    title: "Cardiac Case",
    text: "45-year-old male presents to ED with acute onset chest pain radiating to left arm, associated with shortness of breath and diaphoresis. Patient has history of diabetes mellitus type 2 and hypertension. Vital signs: BP 160/95, HR 102, RR 22, O2 sat 96% on room air. ECG shows ST elevation in leads II, III, aVF. Troponin I elevated at 15.2 ng/mL (normal <0.04). Patient appears anxious but cooperative."
  },
  {
    title: "Post-Operative Case", 
    text: "Post-operative day 3 following laparoscopic appendectomy. Patient reports moderate incisional pain (6/10) and mild nausea. Surgical sites appear clean and dry without signs of infection. Patient has been ambulating and tolerating clear liquids well. Temperature 99.1°F, other vital signs stable. Patient has history of hypertension, well-controlled on lisinopril. Ready for discharge with follow-up instructions."
  },
  {
    title: "Diabetes Management",
    text: "62-year-old female with poorly controlled diabetes mellitus type 2 presents for routine follow-up. HbA1c 9.8%, fasting glucose 245 mg/dL. Patient reports increased fatigue, frequent urination, and blurred vision over past month. Current medications include metformin 1000mg BID. Blood pressure 145/88. Microalbumin positive. Diabetic retinopathy screening due. Patient counseled on importance of medication compliance and dietary modifications."
  }
];
