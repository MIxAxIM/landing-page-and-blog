export type TerminologyKeys =
  | 'organization'
  | 'treasury'
  | 'escrow'
  | 'task'
  | 'contributor'
  | 'contributionManager'
  | 'treasuryOwner'
  | 'taskStatus'
  | 'prerequisite'
  | 'credential'
  | 'acceptanceCriteria'

export type TerminologySkin = {
  [K in TerminologyKeys]: string;
};

export type TerminologySkins = {
  [key: string]: TerminologySkin;
};
