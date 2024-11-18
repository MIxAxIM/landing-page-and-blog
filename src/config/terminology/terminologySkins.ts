import { TerminologySkins } from "~/types/terminology";

export const terminologySkins: TerminologySkins = {
	default: {
		organization: 'organization',
		treasury: 'treasury',
		escrow: 'escrow',
		task: 'task',
		contributor: 'contributor',
		taskStatus: 'status',
		prerequisite: 'prerequisite',
		credential: 'credential',
	},
	leadGen: {
		organization: 'organization',
		treasury: 'organization',
		escrow: 'project',
		task: 'task',
		contributor: 'contributor',
		taskStatus: 'progress',
		prerequisite: 'prerequisite',
		credential: 'credential',
	},
	validatorNames: {
		organization: 'organization',
		treasury: 'treasury',
		escrow: 'escrow',
		task: 'task',
		contributor: 'contributor',
		taskStatus: 'status',
		prerequisite: 'prerequisite',
		credential: 'credential',
	},
	testTerms: {
		organization: 'organization',
		treasury: 'project',
		escrow: 'escrow',
		task: 'task',
		contributor: 'contributor',
		taskStatus: 'status',
		prerequisite: 'prerequisite',
		credential: 'credential',
	},
} as const;
