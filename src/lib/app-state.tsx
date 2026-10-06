/**
 * Prototype application state.
 *
 * Everything lives in React state and (where useful) localStorage. There is no
 * backend in this prototype: nothing is transmitted to any authority or
 * contact. Swap this provider for API-backed hooks when real services are
 * integrated.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SafetyStatus = "safe" | "help" | "unknown";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  status: SafetyStatus;
  lastCheckIn: string | null;
  sharesLocation: boolean;
  city: string;
}

export interface SosCase {
  id: string;
  type: string;
  typeLabel: string;
  note: string;
  createdAt: string;
  location: string | null;
  notified: string[];
  status: "open" | "acknowledged";
}

export interface PrivacySettings {
  shareLocation: boolean;
  shareStatusWithFamily: boolean;
  shareStatusWithMission: boolean;
  preciseLocationInSos: boolean;
  pushAlerts: boolean;
  emailDigest: boolean;
  language: string;
}

export interface Profile {
  name: string;
  initials: string;
  country: string;
  city: string;
  passportNote: string;
  phone: string;
}

interface AppState {
  profile: Profile;
  setProfile: (p: Profile) => void;
  status: SafetyStatus;
  lastCheckIn: string | null;
  checkIn: (status: SafetyStatus) => void;
  family: FamilyMember[];
  addFamilyMember: (m: Omit<FamilyMember, "id">) => void;
  removeFamilyMember: (id: string) => void;
  cases: SosCase[];
  createCase: (c: Omit<SosCase, "id" | "createdAt" | "status">) => SosCase;
  privacy: PrivacySettings;
  setPrivacy: (p: Partial<PrivacySettings>) => void;
  locationPermission: "unknown" | "granted" | "denied";
  requestLocation: () => Promise<string | null>;
  approxLocation: string | null;
  hydrated: boolean;
}

const defaultProfile: Profile = {
  name: "Aarav Rao",
  initials: "AR",
  country: "United Arab Emirates",
  city: "Dubai",
  passportNote: "Passport details are never stored in this prototype",
  phone: "+971 50 000 0000",
};

const defaultFamily: FamilyMember[] = [
  { id: "F1", name: "Meera Rao", relation: "Mother", status: "safe", lastCheckIn: "2026-10-01T06:10:00Z", sharesLocation: false, city: "Pune, India" },
  { id: "F2", name: "Kabir Rao", relation: "Brother", status: "safe", lastCheckIn: "2026-10-01T03:40:00Z", sharesLocation: true, city: "Dubai, UAE" },
  { id: "F3", name: "Sana Iyer", relation: "Friend", status: "unknown", lastCheckIn: null, sharesLocation: false, city: "Sharjah, UAE" },
];

const defaultPrivacy: PrivacySettings = {
  shareLocation: false,
  shareStatusWithFamily: true,
  shareStatusWithMission: false,
  preciseLocationInSos: true,
  pushAlerts: true,
  emailDigest: false,
  language: "English",
};

const Ctx = createContext<AppState | null>(null);

const STORAGE_KEY = "bsc-prototype-state-v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [status, setStatus] = useState<SafetyStatus>("safe");
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(
    "2026-10-01T04:12:00Z",
  );
  const [family, setFamily] = useState<FamilyMember[]>(defaultFamily);
  const [cases, setCases] = useState<SosCase[]>([]);
  const [privacy, setPrivacyState] = useState<PrivacySettings>(defaultPrivacy);
  const [locationPermission, setLocationPermission] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [approxLocation, setApproxLocation] = useState<string | null>(null);

  // Restore after hydration so SSR and the first client render match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<{
          profile: Profile;
          status: SafetyStatus;
          lastCheckIn: string | null;
          family: FamilyMember[];
          cases: SosCase[];
          privacy: PrivacySettings;
        }>;
        if (saved.profile) setProfile(saved.profile);
        if (saved.status) setStatus(saved.status);
        if (saved.lastCheckIn !== undefined) setLastCheckIn(saved.lastCheckIn);
        if (saved.family) setFamily(saved.family);
        if (saved.cases) setCases(saved.cases);
        if (saved.privacy) setPrivacyState({ ...defaultPrivacy, ...saved.privacy });
      }
    } catch {
      /* ignore corrupted prototype state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile, status, lastCheckIn, family, cases, privacy }),
      );
    } catch {
      /* storage unavailable */
    }
  }, [hydrated, profile, status, lastCheckIn, family, cases, privacy]);

  const checkIn = useCallback((next: SafetyStatus) => {
    setStatus(next);
    setLastCheckIn(new Date().toISOString());
  }, []);

  const addFamilyMember = useCallback((m: Omit<FamilyMember, "id">) => {
    setFamily((prev) => [...prev, { ...m, id: `F${Date.now()}` }]);
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    setFamily((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const createCase = useCallback(
    (c: Omit<SosCase, "id" | "createdAt" | "status">) => {
      const created: SosCase = {
        ...c,
        id: `IND-${Math.floor(10000 + Math.random() * 89999)}`,
        createdAt: new Date().toISOString(),
        status: "open",
      };
      setCases((prev) => [created, ...prev]);
      setStatus("help");
      setLastCheckIn(new Date().toISOString());
      return created;
    },
    [],
  );

  const setPrivacy = useCallback((p: Partial<PrivacySettings>) => {
    setPrivacyState((prev) => ({ ...prev, ...p }));
  }, []);

  const requestLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationPermission("denied");
      return null;
    }
    return new Promise<string | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Rounded to ~1 km so an exact position is never stored or shown.
          const value = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)} (approximate)`;
          setApproxLocation(value);
          setLocationPermission("granted");
          resolve(value);
        },
        () => {
          setLocationPermission("denied");
          resolve(null);
        },
        { timeout: 8000 },
      );
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      profile,
      setProfile,
      status,
      lastCheckIn,
      checkIn,
      family,
      addFamilyMember,
      removeFamilyMember,
      cases,
      createCase,
      privacy,
      setPrivacy,
      locationPermission,
      requestLocation,
      approxLocation,
      hydrated,
    }),
    [
      profile,
      status,
      lastCheckIn,
      checkIn,
      family,
      addFamilyMember,
      removeFamilyMember,
      cases,
      createCase,
      privacy,
      setPrivacy,
      locationPermission,
      requestLocation,
      approxLocation,
      hydrated,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

export function formatWhen(iso: string | null) {
  if (!iso) return "No recent check-in";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
