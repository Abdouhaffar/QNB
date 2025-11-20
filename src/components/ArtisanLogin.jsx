// src/components/ArtisanLogin.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase/config'; 
import { useNavigate } from 'react-router-dom'; // لتوجيه المستخدم بعد تسجيل الدخول

const ArtisanLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
            setLoading(false);
            return;
        }

        try {
            // **منطق Firebase Authentication الفعلي**
            await signInWithEmailAndPassword(auth, email, password);
            
            setError('✅ تم تسجيل الدخول بنجاح! جاري التوجيه...');
            
            // التوجيه إلى صفحة الحساب الشخصي أو لوحة التحكم
            // navigate('/dashboard'); 

        } catch (err) {
            console.error("Login error:", err);
            let errorMessage = '❌ فشل تسجيل الدخول. تأكد من صحة البيانات.';
            if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                 errorMessage = '❌ البيانات المدخلة غير صحيحة (الإيميل أو كلمة المرور).';
            }
            setError(errorMessage);
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
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="أدخل بريدك الإلكتروني" required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            كلمة المرور
                        </label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="أدخل كلمة المرور" required
                        />
                    </div>

                    {error && (
                        <p className={`p-3 text-sm rounded-lg ${error.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-blue-400 shadow-md"
                    >
                        {loading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 pt-2">
                        <a href="#" className="text-blue-600 hover:underline">نسيت كلمة المرور؟</a> (تتطلب إعداد استعادة كلمة المرور في Firebase)
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ArtisanLogin;
