const fs = require('fs');

let content = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

const guestButtonString = `
            {/* Guest Login Action */}
            <button
              className="btn-secondary w-full py-3 rounded font-mono text-[12px] font-bold tracking-widest uppercase text-tertiary border border-tertiary hover:bg-tertiary/10 flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95"
              type="button"
              onClick={() => onLogin({ id: 'guest', email: 'guest@blackouthockey.com', role: 'Guest' })}
            >
              CONTINUE AS GUEST
            </button>
`;

content = content.replace(
  /<\/form>/,
  `</form>\n${guestButtonString}`
);

fs.writeFileSync('src/components/LoginScreen.tsx', content);
