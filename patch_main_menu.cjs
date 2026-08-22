const fs = require('fs');
let code = fs.readFileSync('src/components/MainMenuScreen.tsx', 'utf8');

let search = `interface MainMenuScreenProps {
  onNewGame: () => void;
  onLogout: () => void;
  onDatabase: () => void;
}`;
let replacement = `interface MainMenuScreenProps {
  onNewGame: () => void;
  onLogout: () => void;
  onDatabase: () => void;
  onStats: () => void;
}`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
} else {
    console.log('Could not find first search string in MainMenuScreen.tsx');
}

search = `export default function MainMenuScreen({ onNewGame, onLogout, onDatabase }: MainMenuScreenProps) {`;
replacement = `export default function MainMenuScreen({ onNewGame, onLogout, onDatabase, onStats }: MainMenuScreenProps) {`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
} else {
    console.log('Could not find second search string in MainMenuScreen.tsx');
}

search = `import { Play, Calendar, Settings as SettingsIcon, Download, Upload, LogOut, User, Database as DatabaseIcon, CheckCircle, XCircle } from 'lucide-react';`;
replacement = `import { Play, Calendar, Settings as SettingsIcon, Download, Upload, LogOut, User, Database as DatabaseIcon, CheckCircle, XCircle, Trophy } from 'lucide-react';`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
} else {
    console.log('Could not find third search string in MainMenuScreen.tsx');
}

search = `<button
            onClick={onDatabase}
            className="w-full bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[14px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex items-center justify-center gap-2 uppercase shadow-md inner-glow relative"
          >
            <DatabaseIcon className="w-5 h-5" />
            DATABASE
            {dbStatus === 'success' && (
              <CheckCircle className="w-4 h-4 text-green-500 absolute right-4" />
            )}
            {dbStatus === 'error' && (
              <XCircle className="w-4 h-4 text-error absolute right-4" />
            )}
          </button>`;
replacement = `<div className="flex gap-3 w-full">
            <button
              onClick={onDatabase}
              className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[14px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow relative"
            >
              <DatabaseIcon className="w-5 h-5" />
              DATABASE
              {dbStatus === 'success' && (
                <CheckCircle className="w-3 h-3 text-green-500 absolute top-2 right-2" />
              )}
              {dbStatus === 'error' && (
                <XCircle className="w-3 h-3 text-error absolute top-2 right-2" />
              )}
            </button>
            <button
              onClick={onStats}
              className="flex-1 bg-[#050505] border border-[#2A2A2A] text-on-surface-variant font-mono text-[14px] font-bold tracking-widest py-3.5 rounded-lg hover:text-white hover:border-outline-variant active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 uppercase shadow-md inner-glow"
            >
              <Trophy className="w-5 h-5 text-tertiary" />
              STATS
            </button>
          </div>`;

if (code.includes(search)) {
    code = code.replace(search, replacement);
    fs.writeFileSync('src/components/MainMenuScreen.tsx', code);
    console.log('MainMenuScreen.tsx Patched correctly');
} else {
    console.log('Could not find fourth search string in MainMenuScreen.tsx');
}
