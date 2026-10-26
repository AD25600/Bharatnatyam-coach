// Decorative illustrations used on the landing page (pure SVG, no assets).

export function DancerIllustration() {
  return (
    <svg className="dancer-illustration" viewBox="0 0 430 455" role="img" aria-label="Stylised Bharatanatyam dancer in aramandi">
            <defs>
              <linearGradient id="nd-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7e8dc"/><stop offset="1" stopColor="#dfb39b"/></linearGradient>
              <linearGradient id="nd-sari" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b85f66"/><stop offset="1" stopColor="#7f303d"/></linearGradient>
              <linearGradient id="nd-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4d59a"/><stop offset="1" stopColor="#a56d37"/></linearGradient>
            </defs>
            <rect width="430" height="455" fill="url(#nd-bg)"/>
            <g opacity=".24" fill="none" stroke="#a66d50" strokeWidth="1.5">
              <path d="M25 455V190Q25 70 215 28Q405 70 405 190V455"/>
              <path d="M42 455V195Q42 85 215 48Q388 85 388 195V455"/>
              <circle cx="215" cy="125" r="62"/><circle cx="215" cy="125" r="48"/>
              <path d="M215 50l12 40 36-20-20 36 40 19-42 4 5 42-31-28-31 28 5-42-42-4 40-19-20-36 36 20z"/>
              <path d="M10 430q30-35 0-70m410 70q-30-35 0-70"/>
            </g>
            <ellipse cx="219" cy="423" rx="130" ry="15" fill="#9d6c55" opacity=".2"/>
            {/* fan-shaped pleated costume */}
            <path d="M204 230 Q135 256 84 356 Q206 405 330 354 Q291 266 230 230Z" fill="url(#nd-sari)" stroke="#6f3037" strokeWidth="2"/>
            <path d="M209 244L132 365M216 245L166 379M222 245L202 388M228 245L239 386M234 244L276 375M240 241L310 356" stroke="#e9b56c" strokeWidth="3" opacity=".9"/>
            <path d="M90 356Q205 391 326 354" fill="none" stroke="url(#nd-gold)" strokeWidth="8"/>
            {/* legs in aramandi stance */}
            <path d="M194 245Q177 285 160 316L121 350Q111 358 121 367Q131 372 141 363L190 337Q211 310 226 274" fill="#a96c51" stroke="#75412f" strokeWidth="3" strokeLinecap="round"/>
            <path d="M226 266Q247 296 274 316L314 330Q328 332 329 343Q327 352 313 347L265 339Q232 323 207 292" fill="#b77a5c" stroke="#75412f" strokeWidth="3" strokeLinecap="round"/>
            {/* torso */}
            <path d="M186 133Q211 121 235 139L250 228Q220 249 190 228L177 166Z" fill="url(#nd-sari)" stroke="#74313a" strokeWidth="2"/>
            <path d="M186 142Q215 170 241 143L250 228Q218 244 190 228Z" fill="#d18a77"/>
            <path d="M189 146L230 220M198 143L239 213M185 158L225 233" stroke="#e9bd78" strokeWidth="3"/>
            {/* left arm reaching outward */}
            <path d="M185 145Q157 153 143 177L102 213Q91 219 85 210Q83 201 96 194L128 162Q153 128 184 128" fill="#b77a5c" stroke="#75412f" strokeWidth="3" strokeLinecap="round"/>
            <path d="M101 213L83 210M91 216L78 219M94 209L84 201" stroke="#75412f" strokeWidth="2" strokeLinecap="round"/>
            {/* raised right arm */}
            <path d="M231 145Q256 119 265 91L259 48Q260 37 271 38Q280 40 279 52L288 99Q287 129 250 167" fill="#bd8061" stroke="#75412f" strokeWidth="3" strokeLinecap="round"/>
            <path d="M260 48L253 34M266 43L266 28M273 44L280 31" stroke="#75412f" strokeWidth="2" strokeLinecap="round"/>
            {/* neck and face */}
            <path d="M198 127L198 111L224 111L225 137" fill="#b77a5c" stroke="#75412f" strokeWidth="2"/>
            <ellipse cx="211" cy="88" rx="30" ry="37" fill="#bd8061" stroke="#75412f" strokeWidth="2"/>
            {/* hair and bun */}
            <path d="M181 92Q174 57 200 48Q231 42 241 69L238 96Q230 76 218 72Q199 83 181 92Z" fill="#2e211d"/>
            <circle cx="235" cy="65" r="17" fill="#2e211d" stroke="url(#nd-gold)" strokeWidth="4"/>
            <path d="M184 75Q207 56 235 75" fill="none" stroke="url(#nd-gold)" strokeWidth="4"/>
            {/* face details */}
            <path d="M195 88q6-5 11 0M217 88q6-5 11 0" fill="none" stroke="#3d231d" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="207" cy="96" r="2.5" fill="#3d231d"/><path d="M207 97l-2 7 5 1" fill="none" stroke="#7b4435" strokeWidth="1.5"/>
            <path d="M201 110q9 6 17-1" fill="none" stroke="#7e3438" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="211" cy="77" r="4" fill="#a22f3c"/><path d="M211 69v-8" stroke="url(#nd-gold)" strokeWidth="3"/>
            {/* jewelry */}
            <path d="M194 122q17 20 34 0" fill="none" stroke="url(#nd-gold)" strokeWidth="5"/>
            <path d="M188 139q24 18 47 0" fill="none" stroke="url(#nd-gold)" strokeWidth="4"/>
            <circle cx="191" cy="98" r="4" fill="url(#nd-gold)"/><circle cx="231" cy="98" r="4" fill="url(#nd-gold)"/>
            <path d="M191 150L184 188M235 150L244 190" stroke="url(#nd-gold)" strokeWidth="4"/>
            <path d="M192 225Q216 238 247 225" fill="none" stroke="url(#nd-gold)" strokeWidth="7"/>
            <path d="M183 231Q215 250 253 230" fill="none" stroke="#f3d18c" strokeWidth="4"/>
            {/* ankle bells */}
            <path d="M117 351l15 12M310 329l-4 14" stroke="url(#nd-gold)" strokeWidth="5"/>
            <g fill="#f0d29a"><circle cx="122" cy="356" r="3"/><circle cx="130" cy="360" r="3"/><circle cx="139" cy="357" r="3"/><circle cx="308" cy="335" r="3"/><circle cx="317" cy="337" r="3"/></g>
            {/* floor motifs */}
            <g fill="none" stroke="#b78264" strokeWidth="1.4" opacity=".65"><path d="M22 414q22-16 44 0q-22 17-44 0zm342 0q22-16 44 0q-22 17-44 0z"/><circle cx="215" cy="422" r="7"/><path d="M215 409v26m-13-13h26"/></g>
    </svg>
  );
}

export function SkeletonPreview() {
  return (
    <svg viewBox="0 0 300 265" role="img" aria-label="Illustrative pose skeleton overlay">
                <defs><linearGradient id="nd-stage" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5e554e"/><stop offset="1" stopColor="#8d7766"/></linearGradient></defs>
                <rect width="300" height="265" fill="url(#nd-stage)"/>
                <path d="M0 218Q80 196 150 218T300 213V265H0Z" fill="#403b36" opacity=".45"/>
                <g stroke="#e9bd73" strokeWidth="1" opacity=".3"><path d="M20 0V265M60 0V265M100 0V265M140 0V265M180 0V265M220 0V265M260 0V265"/></g>
                <g fill="none" stroke="#55d39a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M145 76L128 111L106 141L70 158L47 150"/>
                  <path d="M128 111L153 132L190 143L231 126L254 105"/>
                  <path d="M128 111L150 151L143 188L111 218"/>
                  <path d="M150 151L174 181L212 204L241 199"/>
                </g>
                <g fill="none" stroke="#ef7864" strokeWidth="4" strokeLinecap="round"><path d="M145 76L166 50L185 31"/><path d="M143 188L159 220L184 232"/></g>
                <g fill="#fff1d5" stroke="#fff" strokeWidth="1.5">
                  <circle cx="145" cy="76" r="6"/><circle cx="128" cy="111" r="5"/><circle cx="106" cy="141" r="5"/><circle cx="70" cy="158" r="5"/><circle cx="47" cy="150" r="5"/>
                  <circle cx="153" cy="132" r="5"/><circle cx="190" cy="143" r="5"/><circle cx="231" cy="126" r="5"/><circle cx="254" cy="105" r="5"/>
                  <circle cx="150" cy="151" r="5"/><circle cx="143" cy="188" r="5"/><circle cx="111" cy="218" r="5"/><circle cx="174" cy="181" r="5"/><circle cx="212" cy="204" r="5"/><circle cx="241" cy="199" r="5"/>
                </g>
                <circle cx="145" cy="55" r="18" fill="#c38d69" stroke="#2f2520" strokeWidth="5"/>
                <path d="M129 71Q145 82 160 70" stroke="#d6a77d" strokeWidth="13" fill="none"/>
                <text x="12" y="20" fontSize="9" fill="#fff4e7" letterSpacing="1">POSE LANDMARKS</text>
    </svg>
  );
}
