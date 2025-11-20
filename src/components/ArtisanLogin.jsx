import React, { useState } from 'react';
// import { signInWithEmailAndPassword } from 'firebase/auth'; // استخدم هذه الوظيفة إذا استخدمت الإيميل
// import { auth } from '../firebase/config'; // استيراد مثيل المصادقة

const ArtisanLogin = () => {
    const [loginId, setLoginId] = useState(''); // يمكن أن يكون رقم الهاتف أو الإيميل
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!loginId || !password) {
            setError('الرجاء إدخال رقم الهاتف/الإيميل وكلمة المرور.');
            setLoading(false);
            return;
        }

        try {
            // **منطق Firebase Authentication Placeholder**
            
            // بما أن Firebase Authentication مصمم للتعامل مع الإيميل/كلمة المرور،
            // سنفترض أن الحرفي يستخدم الإيميل وكلمة المرور الخاصة به.
            // إذا كان المطلوب هو رقم الهاتف، سنحتاج لاستخدام حلول أخرى مثل
            // البحث عن الحساب برقم الهاتف في Firestore ثم مقارنة كلمة المرور المشفرة.
            
            /* // إذا استخدمنا الإيميل/كلمة المرور
            await signInWithEmailAndPassword(auth, loginId, password);
            */

            // **محاكاة نجاح تسجيل الدخول (في التطبيق الحقيقي، هذا يتم عبر Firebase):**
            console.log("Login successful! Redirecting..."); 
            // يتم توجيه المستخدم إلى صفحة ملفه الشخصي (مثلاً)
            
            setError('✅ تم تسجيل الدخول بنجاح! جاري التوجيه...');

        } catch (err) {
            console.error("Login error:", err);
            setError('❌ فشل تسجيل الدخول. تأكد من صحة البيانات أو حاول لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">تسجيل الدخول للحرفيين</h1>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف أو البريد الإلكتروني
                        </label>
                        <input
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="أدخل رقمك أو إيميلك"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            كلمة المرور / الكود السري
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="أدخل كلمة المرور"
                            required
                        />
                    </div>

                    {error && (
                        <p className={`p-3 text-sm rounded-lg ${error.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-blue-400 shadow-md"
                    >
                        {loading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 pt-2">
                        نسيت كلمة المرور؟ <a href="#" className="text-blue-600 hover:underline">اضغط هنا</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ArtisanLogin;
