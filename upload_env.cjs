const { execSync } = require('child_process');

const envs = {
    VITE_TELEGRAM_BOT_TOKEN: "8367371112:AAGTQ4Fi75uTv7u45WHKIFHnKev2e_DJhxo",
    VITE_TELEGRAM_CHAT_ID: "94178257",
    VITE_GEMINI_API_KEY: "apikey-af1ca5ba9130435ab29d9cbb586972f6",
    VITE_SUPABASE_URL: "https://qyjpclcdeyfcwvqxngle.supabase.co",
    VITE_SUPABASE_ANON_KEY: "sb_publishable__ZsXonAtrMLIN0h63zGAw_ByrPCOC3",
    VITE_PHONE_NUMBER: "031-957-8949",
    VITE_TELEGRAM_URL: "https://t.me/your_telegram_id",
    VITE_AGENCY_NAME: "px마을 부동산",
    VITE_AGENT_NAME: "이영호",
    VITE_REGISTRATION_NO: "제41480-2023-00017호",
    VITE_AGENCY_ADDRESS: "경기도 파주시 학령로105(아동동)",
    VITE_KAKAO_MAP_API_KEY: "2293169e37f2f782bd839e0c835c1d91"
};

for (const [k, v] of Object.entries(envs)) {
    console.log(`Setting ${k}...`);
    try {
        execSync(`npx vercel env rm ${k} production -y`, { stdio: 'ignore' });
    } catch (e) { }
    execSync(`npx vercel env add ${k} production`, { input: v, stdio: ['pipe', 'inherit', 'inherit'] });
}
console.log('Done!');
