export const removeSlash = (s: string) => {
    return s.charAt(0) === '/' ? s.substring(1) : s;
}
