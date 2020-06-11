const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
};

const getRandomInt: (min: number, max: number) => number = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hasPermission = (user: UserType, permission: string) => {
    const permissions = user?.group?.permissions.split(',');
    return permissions?.filter(perm => perm === permission).length > 0;
};

const hasAccessToAdminPanel = (user: UserType) => user.is_superuser || user.group.is_superuser || hasPermission(user, 'admin_panel')

const generateClassName = (baseClassName: string, ...classNames: string[]) => {
    if(classNames.length === 0) return baseClassName;
    else return `${baseClassName} ${classNames.join(" ")}`
}

export { capitalize, getRandomInt, hasPermission, hasAccessToAdminPanel, generateClassName };