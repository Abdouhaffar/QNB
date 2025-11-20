import React, { useState } from 'react';
// استيراد وظائف Firebase (يجب أن يتم ربطها بملف config.js)
// import { collection, addDoc } from 'firebase/firestore'; 
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
// import { db, storage } from '../firebase/config'; // ملف الإعدادات الخاص بك

// **بيانات محاكاة للموقع والتخصصات**
const MOCK_WILAYAS = ['الجزائر', 'وهران', 'قسنطينة', 'عنابة'];
const MOCK_PROFESSIONS = ['نجار', 'سباك', 'كهربائي', 'بناء', 'حداد', 'خياط', 'رسام'];

const ArtisanRegistrationForm = () => {
    // 1. إدارة حالة النموذج
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        profession: '',
        wilaya: '',
        daira: '',
        baladiya: '',
        experienceYears: 0,
        bio: '',
        secretCode: '' // رقم سري لتأمين الحساب
    });
    
    // 2. إدارة حالة تحميل الملفات
    const [profileImage, setProfileImage] = useState(null);
    const [workImages, setWorkImages] = useState([]);
    
    // 3. حالة واجهة المستخدم والرسائل
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // تحديث البيانات عند تغيير حقول الإدخال
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // معالجة تغيير صورة الملف الشخصي
    const handleProfileImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    // معالجة تغيير صور الأعمال (يسمح بأكثر من صورة)
    const handleWorkImagesChange = (e) => {
        if (e.target.files.length > 0) {
            // تحويل FileList إلى مصفوفة
            setWorkImages(Array.from(e.target.files).slice(0, 5)); // تحديد حد أقصى مثلاً 5 صور
        }
    };

    // وظيفة رفع الملفات إلى Firebase Storage
    const uploadFile = async (file, path) => {
        // **هذا هو منطق Firebase Storage Placeholder**
        
        // 1. إنشاء مرجع للملف
        // const storageRef = ref(storage, path + file.name);
        
        // 2. رفع الملف
        // await uploadBytes(storageRef, file);
        
        // 3. الحصول على رابط التحميل
        // const fileUrl = await getDownloadURL(storageRef);
        // return fileUrl;
        
        // محاكاة مؤقتة لرابط التحميل
        return `https://mockstorage.com/${path}/${file.name}`; 
    };

    // معالجة إرسال النموذج
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 1. التحقق من الصور الأساسية
        if (!profileImage || workImages.length === 0) {
            setMessage('الرجاء رفع صورة شخصية وصورة عمل واحدة على الأقل.');
            setLoading(false);
            return;
        }

        try {
            // **2. رفع الصور إلى Firebase Storage**
            
            // رفع الصورة الشخصية
            const profilePath = `artisans/${formData.phoneNumber}/profile/`;
            const profileUrl = await uploadFile(profileImage, profilePath);

            // رفع صور الأعمال
            const workPath = `artisans/${formData.phoneNumber}/works/`;
            const workUrls = await Promise.all(
                workImages.map(img => uploadFile(img, workPath))
            );

            // **3. حفظ البيانات في Firebase Firestore**
            
            const artisanData = {
                ...formData,
                profilePictureUrl: profileUrl,
                workImagesUrls: workUrls,
                status: 'pending', // يبدأ الحساب كـ "قيد المراجعة"
                isVIP: false,
                createdAt: new Date().toISOString(),
            };

            // حفظ بيانات الحرفي في مجموعة artisans
            // await addDoc(collection(db, "artisans"), artisanData);

            setMessage('✅ تم إرسال طلب التسجيل بنجاح! سيتم مراجعة حسابك وتفعيله قريباً.');
            setFormData({
                fullName: '', phoneNumber: '', profession: '', wilaya: '', daira: '', 
                baladiya: '', experienceYears: 0, bio: '', secretCode: ''
            });
            setProfileImage(null);
            setWorkImages([]);
            
        } catch (error) {
            console.error("Error submitting form: ", error);
            setMessage('❌ حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-bold text-center text-green-600 mb-8">تسجيل حساب حرفي جديد</h1>
            
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                
                {/* رسائل التنبيه */}
                {message && (
                    <div className={`p-4 mb-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                {/* **قسم المعلومات الشخصية والمهنية** */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">1. بيانات الحساب والمهنة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    
                    {/* الاسم الكامل */}
                    <InputField 
                        label="الاسم واللقب" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        required
                    />
                    
                    {/* رقم الهاتف */}
                    <InputField 
                        label="رقم الهاتف (سيستخدم كمعرّف)" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        type="tel"
                        placeholder="مثال: 0550123456"
                        required
                    />

                    {/* كلمة المرور/الرقم السري */}
                    <InputField 
                        label="كلمة المرور / الرقم السري" 
                        name="secretCode" 
                        value={formData.secretCode} 
                        onChange={handleChange} 
                        type="password"
                        placeholder="لتأمين حسابك"
                        required
                    />
                    
                    {/* المهنة/التخصص */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المهنة/التخصص</label>
                        <select 
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">اختر التخصص</option>
                            {MOCK_PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {/* سنوات الخبرة */}
                    <InputField 
                        label="سنوات الخبرة" 
                        name="experienceYears" 
                        value={formData.experienceYears} 
                        onChange={handleChange} 
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                    />
                </div>

                {/* **قسم الموقع الجغرافي** */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">2. الموقع الجغرافي</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    
                    {/* الولاية */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                        <select 
                            name="wilaya"
                            value={formData.wilaya}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">اختر الولاية</option>
                            {/* هنا سيتم جلب البيانات من ملف JSON Structured Data */}
                            {MOCK_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                    </div>

                    {/* الدائرة (Daira) */}
                    <InputField 
                        label="الدائرة (اختياري)" 
                        name="daira" 
                        value={formData.daira} 
                        onChange={handleChange} 
                        type="text"
                        placeholder="اسم الدائرة"
                    />

                    {/* البلدية (Baladiya) */}
                    <InputField 
                        label="البلدية" 
                        name="baladiya" 
                        value={formData.baladiya} 
                        onChange={handleChange} 
                        type="text"
                        placeholder="اسم البلدية"
                        required
                    />
                </div>

                {/* **قسم السيرة الذاتية (Bio)** */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عن عملك/خبرتك (Bio)</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="صف طبيعة عملك وخبرتك بالتفصيل..."
                        required
                    ></textarea>
                </div>

                {/* **قسم رفع الصور** */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">3. صور الأعمال</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* الصورة الشخصية */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">صورة شخصية (مطلوبة)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                        {profileImage && <p className="mt-2 text-xs text-gray-500">تم اختيار: {profileImage.name}</p>}
                    </div>
                    
                    {/* صور الأعمال */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">صور للأعمال (مطلوبة - بحد أقصى 5)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleWorkImagesChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                        />
                        {workImages.length > 0 && <p className="mt-2 text-xs text-gray-500">تم اختيار {workImages.length} صورة.</p>}
                    </div>
                </div>

                {/* زر الإرسال */}
                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 shadow-xl disabled:bg-green-400"
                    >
                        {loading ? '...جاري إرسال البيانات' : 'تسجيل والإنضمام إلى ARTIZONE'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// **مكون مساعد لحقل الإدخال لتقليل التكرار**
const InputField = ({ label, name, value, onChange, type, placeholder, required = false, min = null }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required={required}
        />
    </div>
);

export default ArtisanRegistrationForm;
