const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const search = "export type Screen = 'splash' | 'main-menu' | 'settings' | 'scorekeeper' | 'database';";
const replacement = "export type Screen = 'splash' | 'main-menu' | 'settings' | 'scorekeeper' | 'database' | 'stats';";

if (code.includes(search)) {
    code = code.replace(search, replacement);
    fs.writeFileSync('src/types.ts', code);
    console.log('types.ts Patched correctly');
} else {
    console.log('Could not find search string in types.ts');
}
