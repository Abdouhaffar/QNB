import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { collection, query, where, getDocs } from 'firebase/firestore'; // استيراد وظائف Firebase

// قم باستيراد بيانات الولايات والبلديات من ملف JSON المهيكل
// import wilayasData from '../data/wilayas.json'; 

const ArtisanSearch = () => {
    const [wilaya, setWilaya] = useState('');
    const [baladiya, setBaladiya] = useState('');
    const [profession, setProfession] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // قائمة بالمهن (يجب أن تكون ثابتة)
    const professionsList = ['نجار', 'سباك', 'كهربائي', 'بناء', 'حداد'];

    // بيانات محاكاة مؤقتة لغرض العرض
    const mockArtisans = [
        { id: '1', fullName: "علي بن أحمد", profession: "نجار", wilaya: "الجزائر", baladiya: "القبة", isVIP: true, experienceYears: 10 },
        { id: '2', fullName: "فاطمة الزهراء", profession: "كهربائي", wilaya: "وهران", baladiya: "وهران", isVIP: false, experienceYears: 5 },
        { id: '3', fullName: "خالد سعيد", profession: "سباك", wilaya: "الجزائر", baladiya: "حسين داي", isVIP: true, experienceYears: 20 },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // **هنا يتم بناء استعلام Firebase Firestore**
        /*
        let q = query(collection(db, "artisans"));

        if (profession) {
            q = query(q, where("profession", "==", profession));
        }
        // ... إضافة باقي شروط البحث (wilaya, baladiya)
        
        const querySnapshot = await getDocs(q);
        const fetchedArtisans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // يتم فرز النتائج محلياً لإظهار VIP أولاً
        fetchedArtisans.sort((a, b) => (b.isVIP - a.isVIP));
        setResults(fetchedArtisans);
        */
        
        // **محاكاة نتائج البحث:**
        let filtered = mockArtisans.filter(a => 
            (!profession || a.profession === profession) &&
            (!wilaya || a.wilaya === wilaya) &&
            (!baladiya || a.baladiya === baladiya)
        );
        // فرز VIP أولاً
        filtered.sort((a, b) => (b.isVIP - a.isVIP));
        setResults(filtered);

        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🔍 البحث عن حرفي موثوق</h1>

            {/* نموذج البحث */}
            <form onSubmit={handleSearch} className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* حقل الولاية */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={wilaya}
                        onChange={(e) => setWilaya(e.target.value)}
                    >
                        <option value="">كل الولايات</option>
                        {/* هنا يتم إضافة خيارات الولايات من ملف wilayasData */}
                        <option value="الجزائر">الجزائر</option>
                        <option value="وهران">وهران</option>
                    </select>
                </div>

                {/* حقل البلدية */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البلدية</label>
                    <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="أدخل البلدية..."
                        value={baladiya}
                        onChange={(e) => setBaladiya(e.target.value)}
                    />
                </div>

                {/* حقل المهنة */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المهنة/التخصص</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                    >
                        <option value="">كل المهن</option>
                        {professionsList.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                
                {/* زر البحث */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-md transition duration-300 disabled:opacity-50"
                        disabled={loading}
                    >
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

                {results.length === 0 && !loading && (
                    <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow">
                        لم يتم العثور على حرفيين يطابقون معايير البحث.
                    </p>
                )}
            </div>
        </div>
    );
};

// **مكون بطاقة الحرفي الفرعي**
const ArtisanCard = ({ artisan }) => (
    <div className={`bg-white p-4 rounded-lg shadow-lg flex justify-between items-center ${artisan.isVIP ? 'border-r-4 border-yellow-500' : 'border-r-4 border-gray-300'}`}>
        <div>
            <Link to={`/artisan/${artisan.id}`} className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-300 flex items-center">
                {artisan.fullName}
                {artisan.isVIP && (
                    <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ml-1 shadow-md">
                        VIP
                    </span>
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
