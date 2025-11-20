import React, { useState } from 'react';
// استيراد وظائف Firebase الفعلية
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; // لإنشاء حساب المصادقة
import { db, storage, auth } from '../firebase/config'; // ملف الإعدادات الخاص بك

// **بيانات محاكاة للموقع والتخصصات (يمكنك استبدالها ببيانات JSON المهيكلة)**
const MOCK_WILAYAS = ['الجزائر', 'وهران', 'قسنطينة', 'عنابة'];
const MOCK_PROFESSIONS = ['نجار', 'سباك', 'كهربائي', 'بناء', 'حداد', 'خياط', 'رسام'];

const ArtisanRegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '', // سنستخدم الإيميل للمصادقة كما هو شائع في Firebase
        phoneNumber: '',
        profession: '',
        wilaya: '',
        daira: '',
        baladiya: '',
        experienceYears: 0,
        bio: '',
        password: '' 
    });
    
    const [profileImage, setProfileImage] = useState(null);
    const [workImages, setWorkImages] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleWorkImagesChange = (e) => {
        if (e.target.files.length > 0) {
            setWorkImages(Array.from(e.target.files).slice(0, 5));
        }
    };

    // **وظيفة رفع الملفات الفعلية إلى Firebase Storage**
    const uploadFile = async (file, path) => {
        const storageRef = ref(storage, path + file.name + Date.now()); // إضافة ختم زمني لضمان التميز
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    // **معالجة إرسال النموذج باستخدام Firebase**
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!profileImage || workImages.length === 0) {
            setMessage('الرجاء رفع صورة شخصية وصورة عمل واحدة على الأقل.');
            setLoading(false);
            return;
        }

        try {
            // 1. إنشاء حساب مصادقة (Auth)
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const uid = userCredential.user.uid;

            // 2. رفع الصور إلى Firebase Storage
            const profilePath = `artisans/${uid}/profile/`;
            const profileUrl = await uploadFile(profileImage, profilePath);

            const workPath = `artisans/${uid}/works/`;
            const workUrls = await Promise.all(
                workImages.map(img => uploadFile(img, workPath))
            );

            // 3. حفظ بيانات الحرفي في Firestore
            const artisanData = {
                uid: uid, // ربط بيانات Firestore بمعرّف المصادقة
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                profession: formData.profession,
                wilaya: formData.wilaya,
                daira: formData.daira,
                baladiya: formData.baladiya,
                experienceYears: formData.experienceYears,
                bio: formData.bio,
                profilePictureUrl: profileUrl,
                workImagesUrls: workUrls,
                status: 'pending', 
                isVIP: false,
                createdAt: serverTimestamp(), // ختم زمني من Firebase
            };

            await addDoc(collection(db, "artisans"), artisanData);

            setMessage('✅ تم إرسال طلب التسجيل بنجاح! سيتم مراجعة حسابك وتفعيله قريباً.');
            // إعادة تعيين النموذج
            setFormData({ fullName: '', email: '', phoneNumber: '', profession: '', wilaya: '', daira: '', baladiya: '', experienceYears: 0, bio: '', password: '' });
            setProfileImage(null);
            setWorkImages([]);
            
        } catch (error) {
            console.error("Error submitting form: ", error);
            let errorMessage = '❌ حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = '❌ هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = '❌ كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل.';
            }
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-bold text-center text-green-600 mb-8">تسجيل حساب حرفي جديد</h1>
            
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                {message && (
                    <div className={`p-4 mb-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">1. بيانات الحساب والمهنة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    <InputField 
                        label="الاسم واللقب" name="fullName" value={formData.fullName} onChange={handleChange} 
                        type="text" placeholder="أدخل اسمك الكامل" required
                    />
                    
                    {/* حقل الإيميل للمصادقة */}
                    <InputField 
                        label="البريد الإلكتروني (لتسجيل الدخول)" name="email" value={formData.email} onChange={handleChange} 
                        type="email" placeholder="example@domain.com" required
                    />

                    {/* كلمة المرور */}
                    <InputField 
                        label="كلمة المرور (الكود السري)" name="password" value={formData.password} onChange={handleChange} 
                        type="password" placeholder="يجب أن تكون 6 أحرف على الأقل" required
                    />

                    <InputField 
                        label="رقم الهاتف" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} 
                        type="tel" placeholder="مثال: 0550123456" required
                    />
                    
                    {/* حقل المهنة */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المهنة/التخصص</label>
                        <select 
                            name="profession" value={formData.profession} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required
                        >
                            <option value="">اختر التخصص</option>
                            {MOCK_PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <InputField 
                        label="سنوات الخبرة" name="experienceYears" value={formData.experienceYears} onChange={handleChange} 
                        type="number" min="0" placeholder="0" required
                    />
                </div>

                {/* باقي النموذج (الموقع، Bio، الصور) - يبقى كما هو */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">2. الموقع الجغرافي</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* ... حقول الولاية، الدائرة، البلدية ... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                        <select 
                            name="wilaya" value={formData.wilaya} onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required
                        >
                            <option value="">اختر الولاية</option>
                            {MOCK_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>

                    <InputField label="الدائرة (اختياري)" name="daira" value={formData.daira} onChange={handleChange} type="text" placeholder="اسم الدائرة" />

                    <InputField label="البلدية" name="baladiya" value={formData.baladiya} onChange={handleChange} type="text
