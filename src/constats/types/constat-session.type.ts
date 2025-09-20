//NOTE: this implemenation is missing the  validation needed for a distributed event driven architecture
//we would need to add class validators and also validate the draft before accepting the constat
export type ConstatSessionStatus = 'draft' | 'submitted';

export interface ConstatSession {
  sessionId: string;

  driverAId: string;
  driverBId?: string;
  ninA?: string;
  ninB?: string;

  draft: {
    dateTime?: string;
    location?: string;
    injuredCount?: number;

    vehicles?: Array<{
      id?: string;
      vehicleId?: string;
      driverRole: 'A' | 'B';
      insurerId?: string;
      insuranceNumber?: string;
      licenseNumber?: string;
      ownerName?: string;
      licensePlate?: string;
      insuranceCompany?: string;
      policyNumber?: string;
      [key: string]: any;
    }>;

    circumstances?: Array<{
      id?: string;
      driverId: string;
      code: number;
      description?: string;
      checked?: boolean;
    }>;

    damages?: Array<{
      id?: string;
      driverId: string;
      description: string;
      photoUrls?: string[];
    }>;

    observations?: Array<{
      id?: string;
      driverId: string;
      note: string;
    }>;

    signatures?: Array<{
      id?: string;
      driverId: string;
      signatureType: 'VISUAL' | 'CRYPTO';
      signatureData: string;
      tempImageUrl?: string;
    }>;
  };

  accepted: string[];

  signatureValidation?: {
    [userId: string]: {
      visualSignatureProvided: boolean;
      cryptoSignatureGenerated: boolean;
      validatedAt?: number;
    };
  };

  status: ConstatSessionStatus;
  createdAt: number;
  updatedAt: number;
}
