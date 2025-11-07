import type { UserRole, EndUserRole, InternalRole } from '~/types/auth';

interface RoleCheckApi {
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  isEndUser: () => boolean;
  isInternalStaff: () => boolean;
  getPrimaryRole: () => UserRole | null;
  getAllRoles: () => UserRole[];
  redirectToDashboard: () => void;
}

/**
 * Composable for checking user roles
 * Supports multiple roles per user
 */
export const useRoleCheck = (): RoleCheckApi => {
  const { user } = useAuth();
  const localePath = useLocalePath();

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return user.value?.roles?.includes(role) ?? false;
  };

  /**
   * Check if user has ANY of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => user.value?.roles?.includes(role)) ?? false;
  };

  /**
   * Check if user has ALL of the specified roles
   */
  const hasAllRoles = (roles: UserRole[]): boolean => {
    return roles.every((role) => user.value?.roles?.includes(role)) ?? false;
  };

  /**
   * Check if user is an end user (customer or store owner)
   */
  const isEndUser = (): boolean => {
    const endUserRoles: EndUserRole[] = ['customer', 'store_owner'];
    return hasAnyRole(endUserRoles);
  };

  /**
   * Check if user is internal staff (support, employee, vendor)
   */
  const isInternalStaff = (): boolean => {
    const internalRoles: InternalRole[] = ['support', 'employee', 'vendor'];
    return hasAnyRole(internalRoles);
  };

  /**
   * Get user's primary role (first role in array)
   */
  const getPrimaryRole = (): UserRole | null => {
    return user.value?.roles?.[0] ?? null;
  };

  /**
   * Get all user roles
   */
  const getAllRoles = (): UserRole[] => {
    return user.value?.roles ?? [];
  };

  /**
   * Redirect to appropriate dashboard based on primary role
   */
  const redirectToDashboard = (): void => {
    // Everyone goes to /dashboard, which shows role-specific content
    navigateTo(localePath('/dashboard'));
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isEndUser,
    isInternalStaff,
    getPrimaryRole,
    getAllRoles,
    redirectToDashboard,
  };
};
