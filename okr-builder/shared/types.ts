export type KeyResult = {
  __typename?: 'KeyResult';
  id: Scalars['String'];
  actualProgress?: Maybe<Progress>;
  baseline?: Maybe<Scalars['Float']>;
  benefitType?: Maybe<Scalars['String']>;
  difficulty?: Maybe<KeyResultDifficulty>;
  dueDate?: Maybe<Scalars['Instant']>;
  priority?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Instant']>;
  state?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  target?: Maybe<Scalars['Float']>;
  targetProgress?: Maybe<Progress>;
  units?: Maybe<Scalars['String']>;
};

export enum KeyResultDifficulty {
  Aspirational = 'Aspirational',
  Committed = 'Committed',
  Unset = 'Unset',
}

export type Progress = {
  __typename?: 'Progress';
  percent?: Maybe<Scalars['Float']>;
  progress?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

export type Objective = {
  __typename?: 'Objective';
  id: Scalars['String'];
  keyResults: KeyResult[];
  dueDate?: Maybe<Scalars['Instant']>;
  priority?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['Instant']>;
  state?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
};

// These were not in the provided types, but are needed for the graphql types to work
type Maybe<T> = T | null;
type Scalars = {
  String: string,
  Float: number,
  Instant: string, // Assuming Instant is a string in ISO 8601 format
}