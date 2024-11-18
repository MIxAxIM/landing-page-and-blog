export type TerminologyKeys =
  | 'organization'
  | 'treasury'
  | 'escrow'
  | 'task'
  | 'contributor'
  | 'taskStatus'
  | 'prerequisite'
  | 'credential'

export type TerminologySkin = {
  [K in TerminologyKeys]: string;
};

export type TerminologySkins = {
  [key: string]: TerminologySkin;
};
