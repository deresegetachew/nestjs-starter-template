interface IAccessControlPolciy {
    actions?: string[],
    conditions?: any,
    description?: string,
    effect?: IEffect,
    id?: string
    resources?: string[],
    subjects?: string[]
}

enum IEffect {
    Allow = "allow",
    Deny = "deny"
}

export { IAccessControlPolciy, IEffect };