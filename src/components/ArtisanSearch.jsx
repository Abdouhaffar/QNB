// src/components/ArtisanSearch.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'; 
import { db } from '../firebase/config'; 

// بيانات محاكاة (تبقى كما هي لحين إعداد بيانات الموقع)
const professionsList = ['نجار', 'سباك', 'كهربائي', 'بناء', 'حداد'];
const MOCK_WILAYAS = ['الجزائر', 'وهران', 'قسنطينة', 'عنابة'];

const ArtisanSearch = () => {
    const [wilaya, setWilaya] = useState('');
    const [baladiya, setBaladiya] = useState('');
    const [profession, setProfession] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false); // لمعرفة إذا تم البحث مرة واحدة على الأقل

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);
        setResults([]); // مسح النتائج القديمة

        try {
            // 1. بناء استعلام Firestore
            let q = collection(db, "artisans");
            
            // تصفية الحسابات النشطة فقط
            let filters = [where("status", "==", "active")];

            if (profession) {
                filters.push(where("profession", "==", profession));
            }
            if (wilaya) {
                filters.push(where("wilaya", "==", wilaya));
            }
            if (baladiya) {
                filters.push(where("baladiya", "==", baladiya));
            }
            
            // جمع الفلاتر في الاستعلام
            let finalQuery = query(q, ...filters);
            
            // 2. جلب البيانات
            const querySnapshot = await getDocs(finalQuery);
            let fetchedArtisans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // 3. فرز النتائج: (Firebase لا تسمح بالفرز على حقلين مختلفين إلا بوجود فهرس مركب)
            // سنقوم بالفرز محلياً لضمان ظهور VIP أولاً، ثم حسب الاسم
            fetchedArtisans.sort((a, b) => {
                if (b.isVIP !== a.isVIP) {
                    return b.isVIP - a.isVIP; // VIP أولاً
                }
                return a.fullName.localeCompare(b.fullName); // فرز أبجدي ثانوي
            });

            setResults(fetchedArtisans);

        } catch (error) {
            console.error("Error during search: ", error);
            // في حالة وجود خطأ في الفهرسة (Index), يظهر خطأ هنا.
            alert('حدث خطأ في البحث. قد تحتاج لإنشاء فهارس مركبة في Firebase.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🔍 البحث عن حرفي موثوق</h1>
            
            <form onSubmit={handleSearch} className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* حقل الولاية */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                    <select value={wilaya} onChange={(e) => setWilaya(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">كل الولايات</option>
                        {MOCK_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>

                {/* حقل البلدية */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البلدية</label>
                    <input type="text" placeholder="أدخل البلدية..." value={baladiya} onChange={(e) => setBaladiya(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>

                {/* حقل المهنة */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المهنة/التخصص</label>
                    <select value={profession} onChange={(e) => setProfession(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">كل المهن</option>
                        {professionsList.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                
                {/* زر البحث */}
                <div className="flex items-end">
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-md transition duration-300 disabled:opacity-50">
                        {loading ? 'جاري البحث...' : 'ابحث الآن'}
                    </button>
                </div>
            </form>
            
            {/* نتائج البحث */}
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">النتائج ({results.length})</h2>
            <div className="space-y-4">
                {results.map(artisan => (
                    <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}

                {searched && results.length === 0 && !loading && (
                    <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow">
                        لم يتم العثور على حرفيين يطابقون معايير البحث.
                    </p>
                )}
            </div>
        </div>
    );
};

// **مكون بطاقة الحرفي الفرعي (يبقى كما هو)**
const ArtisanCard = ({ artisan }) => (
    <div className={`bg-white p-4 rounded-lg shadow-lg flex justify-between items-center ${artisan.isVIP ? 'border-r-4 border-yellow-500' : 'border-r-4 border-gray-300'}`}>
        <div>
            <Link to={`/artisan/${artisan.id}`} className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-300 flex items-center">
                {artisan.fullName}
                {artisan.isVIP && (
                    <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ml-1 shadow-md">VIP</span>
                )}
            </Link>
            <p className="text-blue-500 mt-1">{artisan.profession}</p>
            <p className="text-sm text-gray-600">
                {artisan.baladiya}, {artisan.wilaya} | خبرة {artisan.experienceYears} سنوات
            </p>
        </div>
        <div>
            <Link to={`/artisan/${artisan.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300">
                عرض التفاصيل
            </Link>
        </div>
    </div>
);

export default ArtisanSearch;
