export function hasRoleAccess(role: string, requiredRole: string) {
    if (role === 'admin') return true;
    return role === requiredRole;
}