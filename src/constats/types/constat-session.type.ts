export type ConstatSessionStatus = 'draft' | 'submitted';

export interface ConstatSession {
  sessionId: string;

  driverAId: string;
  driverBId?: string;

  draft: {
    dateTime?: string;
    location?: string;
    injuredCount?: number;

    vehicles?: Array<{
      id?: string;
      ownerName?: string;
      licensePlate?: string;
      insuranceCompany?: string;
      policyNumber?: string;
      [key: string]: any;
    }>;

    circumstances?: Array<{
      id?: string;
      description: string;
      checked: boolean;
    }>;

    damages?: Array<{
      id?: string;
      description: string;
      photoUrls?: string[];
    }>;

    observations?: Array<{
      id?: string;
      note: string;
    }>;

    signatures?: Array<{
      id?: string;
      userId: string;
      imageUrl: string;
    }>;
  };

  // userIds of drivers who accepted
  accepted: string[];

  status: ConstatSessionStatus;
  createdAt: number;
  updatedAt: number;
}
