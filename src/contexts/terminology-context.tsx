import { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';
import { terminologySkins } from '~/config/terminology/terminologySkins';
import { type TerminologyKeys, type TerminologySkin } from '~/types/terminology';

interface TerminologyContextType {
	currentSkin?: TerminologySkin;
	skinName: string;
	changeSkin: (newSkinName: string) => void;
	translate: (key: TerminologyKeys) => string;

	translateCaps: (key: TerminologyKeys) => string;
	translatePlural: (key: TerminologyKeys) => string;
	translateCapsPlural: (key: TerminologyKeys) => string;
}

const TerminologyContext = createContext<TerminologyContextType | null>(null);

const STORAGE_KEY = 'terminology-skin';

export function TerminologyProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [skinName, setSkinName] = useState<string>('default');

	// Load saved preference from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved && terminologySkins[saved]) {
			setSkinName(saved);
		}
	}, []);

	const currentSkin = useMemo(() =>
		terminologySkins[skinName] ?? terminologySkins.default
		, [skinName]);

	const translate = useCallback((key: TerminologyKeys): string => {
		if (currentSkin && terminologySkins.default) {
			return currentSkin[key] ?? terminologySkins.default[key];
		}
		return ""
	}, [currentSkin]);

	const translatePlural = useCallback((key: TerminologyKeys): string => {
		if (currentSkin && terminologySkins.default) {
			const term = currentSkin[key] ?? terminologySkins.default[key];
			if (term === "treasury") return "treasuries"
			else return `${term}s`

		}
		return ""
	}, [currentSkin]);

	const translateCaps = useCallback((key: TerminologyKeys): string => {
		if (currentSkin && terminologySkins.default) {
			const term = currentSkin[key] ?? terminologySkins.default[key];
			return term.charAt(0).toUpperCase() + term.slice(1);
		}
		return ""
	}, [currentSkin]);

	const translateCapsPlural = useCallback((key: TerminologyKeys): string => {
		if (currentSkin && terminologySkins.default) {
			const term = currentSkin[key] ?? terminologySkins.default[key];
			if (term === "treasury") return "Treasuries"
			return term.charAt(0).toUpperCase() + term.slice(1) + "s";
		}
		return ""
	}, [currentSkin]);

	const changeSkin = useCallback((newSkinName: string) => {
		if (terminologySkins[newSkinName]) {
			setSkinName(newSkinName);
			localStorage.setItem(STORAGE_KEY, newSkinName);
		}
	}, []);

	const value = useMemo(() => ({
		currentSkin,
		skinName,
		changeSkin,
		translate,
		translateCaps,
		translatePlural,
		translateCapsPlural,
	}), [currentSkin, skinName, changeSkin, translate, translateCaps, translatePlural, translateCapsPlural]);

	return (
		<TerminologyContext.Provider value={value}>
			{children}
		</TerminologyContext.Provider>
	);
}

export function useTerminology() {
	const context = useContext(TerminologyContext);
	if (!context) {
		throw new Error('useTerminology must be used within a TerminologyProvider');
	}
	return context;
}
