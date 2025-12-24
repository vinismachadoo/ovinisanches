export interface ApiDiscoveryEndpoint {
  ApiDiscoveryId: string;
  ApiEndpoint: string;
}

export interface ApiResource {
  ApiFamilyType: string;
  Status: string;
  ApiDiscoveryEndpoints?: ApiDiscoveryEndpoint[];
  [key: string]: unknown;
}

export interface AuthorisationServer {
  CustomerFriendlyLogoUri: string;
  SupportsDCR: boolean;
  SupportsRedirect: boolean;
  CustomerFriendlyName: string;
  AuthorisationServerId: string;
  OrganisationId: string;
  ApiResources?: ApiResource[];
  [key: string]: unknown;
}

export interface Participant {
  OrganisationName: string;
  OrganisationId: string;
  AuthorisationServers?: AuthorisationServer[];
  [key: string]: unknown;
}

// Define the list of requirements to validate, as required
export const REQUIREMENTS_TO_SHOW_IN_CARD = [
  'hasEnrollmentsResource',
  'hasPaymentsConsentsResource',
  'hasPaymentsPixResource',
  'supportsDCR',
  'supportsRedirect',
];

// Define the list of requirements to validate, as required
export const DEFAULT_REQUIREMENTS_TO_VALIDATE = [
  'hasEnrollmentsResource',
  'hasPaymentsConsentsResource',
  'hasPaymentsPixResource',
  // 'supportsDCR',
  // 'supportsRedirect',
];

/**
 * Extracts the path portion from a full URL
 */
export function extractPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    // If it's not a valid URL, assume it's already a path
    return url;
  }
}

/**
 * Checks if a path matches the required pattern
 * Handles path parameters like {enrollmentId} by matching any segment
 * Example: matches("/enrollments/abc123/risk-signals", "/enrollments/{enrollmentId}/risk-signals") -> true
 */
export function matchesPath(path: string, pattern: string): boolean {
  // Normalize both paths (remove trailing slashes, ensure they start with /)
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  const normalizedPattern = pattern.endsWith('/') ? pattern.slice(0, -1) : pattern;

  // Create regex pattern by replacing {param} with a regex group that matches any segment
  const regexPattern = normalizedPattern.replace(/\{[^}]+\}/g, '[^/]+').replace(/\//g, '\\/');

  // Match pattern at the end of the path (to handle different base paths)
  const regex = new RegExp(`${regexPattern}$`);
  return regex.test(normalizedPath);
}

export function checkEnrollmentsResource(authServer: AuthorisationServer): boolean {
  // Required endpoints for enrollments (Status must be Active)
  const enrollmentsResource = authServer?.ApiResources?.find(
    (r) => r.ApiFamilyType === 'enrollments' && r.Status === 'Active'
  );

  if (!enrollmentsResource) {
    return false;
  }

  const enrollmentEndpoints = (enrollmentsResource.ApiDiscoveryEndpoints || []).map((e) => extractPath(e.ApiEndpoint));

  const requiredEnrollmentEndpoints = [
    '/enrollments',
    '/enrollments/{enrollmentId}/risk-signals',
    '/enrollments/{enrollmentId}/fido-registration-options',
    '/enrollments/{enrollmentId}/fido-registration',
    '/enrollments/{enrollmentId}/fido-sign-options',
    '/consents/{consentId}/authorise',
  ];

  // Check if all required enrollment endpoints exist
  for (const required of requiredEnrollmentEndpoints) {
    const found = enrollmentEndpoints.some((endpoint: string) => matchesPath(endpoint, required));
    if (!found) {
      return false;
    }
  }

  return true;
}

export function checkPaymentsConsentsResource(authServer: AuthorisationServer): boolean {
  const paymentsConsentsResource = authServer?.ApiResources?.find(
    (r) => r.ApiFamilyType === 'payments-consents' && r.Status === 'Active'
  );

  if (!paymentsConsentsResource) {
    return false;
  }

  const paymentsConsentsEndpoints = (paymentsConsentsResource.ApiDiscoveryEndpoints || []).map((e) =>
    extractPath(e.ApiEndpoint)
  );

  const requiredPaymentsConsentsEndpoints = ['/consents'];

  for (const required of requiredPaymentsConsentsEndpoints) {
    const found = paymentsConsentsEndpoints.some((endpoint: string) => matchesPath(endpoint, required));
    if (!found) {
      return false;
    }
  }

  return true;
}

export function checkPaymentsPixResource(authServer: AuthorisationServer): boolean {
  const paymentsPixResource = authServer?.ApiResources?.find(
    (r) => r.ApiFamilyType === 'payments-pix' && r.Status === 'Active'
  );

  if (!paymentsPixResource) {
    return false;
  }

  const paymentsPixEndpoints = (paymentsPixResource.ApiDiscoveryEndpoints || []).map((e) => extractPath(e.ApiEndpoint));

  const requiredPaymentsPixEndpoints = ['/pix/payments'];

  for (const required of requiredPaymentsPixEndpoints) {
    const found = paymentsPixEndpoints.some((endpoint: string) => matchesPath(endpoint, required));
    if (!found) {
      return false;
    }
  }

  return true;
}

export function checkSupportsDCR(authServer: AuthorisationServer): boolean {
  return authServer?.SupportsDCR;
}

export function checkSupportsRedirect(authServer: AuthorisationServer): boolean {
  return authServer?.SupportsRedirect;
}
/**
 * Checks if an AuthorisationServer has all requirements to support contactless pix
 */
export function supportsContactlessPix(
  authServer: AuthorisationServer,
  requirementsToValidate: string[] = DEFAULT_REQUIREMENTS_TO_VALIDATE
): {
  hasEnrollmentsResource: boolean;
  hasPaymentsConsentsResource: boolean;
  hasPaymentsPixResource: boolean;
  supportsDCR: boolean;
  supportsRedirect: boolean;
  hasAllRequirements: boolean;
} {
  if (!authServer?.ApiResources || !Array.isArray(authServer.ApiResources)) {
    return {
      hasEnrollmentsResource: false,
      hasPaymentsConsentsResource: false,
      hasPaymentsPixResource: false,
      supportsDCR: false,
      supportsRedirect: false,
      hasAllRequirements: false,
    };
  }

  // Required endpoints for enrollments (Status must be Active)
  const hasEnrollmentsResource = requirementsToValidate.includes('hasEnrollmentsResource')
    ? checkEnrollmentsResource(authServer)
    : false;
  const hasPaymentsConsentsResource = requirementsToValidate.includes('hasPaymentsConsentsResource')
    ? checkPaymentsConsentsResource(authServer)
    : false;
  const hasPaymentsPixResource = requirementsToValidate.includes('hasPaymentsPixResource')
    ? checkPaymentsPixResource(authServer)
    : false;
  const supportsDCR = requirementsToValidate.includes('supportsDCR') ? checkSupportsDCR(authServer) : false;
  const supportsRedirect = requirementsToValidate.includes('supportsRedirect')
    ? checkSupportsRedirect(authServer)
    : false;

  return {
    hasEnrollmentsResource,
    hasPaymentsConsentsResource,
    hasPaymentsPixResource,
    supportsDCR,
    supportsRedirect,
    hasAllRequirements: requirementsToValidate.every((requirement) => {
      switch (requirement) {
        case 'hasEnrollmentsResource':
          return hasEnrollmentsResource;
        case 'hasPaymentsConsentsResource':
          return hasPaymentsConsentsResource;
        case 'hasPaymentsPixResource':
          return hasPaymentsPixResource;
        case 'supportsDCR':
          return supportsDCR;
        case 'supportsRedirect':
          return supportsRedirect;
        default:
          return false;
      }
    }),
  };
}
