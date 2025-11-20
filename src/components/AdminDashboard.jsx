import React, { useState, useEffect } from 'react';
// import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'; 
// import { db } from '../firebase/config'; 

const AdminDashboard = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // **وظيفة جلب جميع الحرفيين من Firebase**
        const fetchArtisans = async () => {
            // const querySnapshot = await getDocs(collection(db, "artisans"));
            // const fetchedArtisans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // محاكاة بيانات مؤقتة
            const mockArtisans = [
                { id: 'a1', fullName: "محمد أمين", profession: "نجار", status: "active", isVIP: true, vipPending: false },
                { id: 'a2', fullName: "علي خالد", profession: "كهربائي", status: "pending", isVIP: false, vipPending: false },
                { id: 'a3', fullName: "سارة فؤاد", profession: "سباك", status: "active", isVIP: false, vipPending: true }, // طلب VIP قيد المراجعة
            ];
            
            setArtisans(mockArtisans);
            setLoading(false);
        };
        fetchArtisans();
    }, []);

    // **وظيفة محاكاة لقبول VIP (في التطبيق الحقيقي، يتم تحديث Firestore)**
    const handleAcceptVIP = async (id) => {
        // const artisanRef = doc(db, "artisans", id);
        // await updateDoc(artisanRef, { isVIP: true, vipPending: false, vipSubscriptionEndDate: new Date() + 1yr });
        
        // تحديث الواجهة
        setArtisans(artisans.map(a => 
            a.id === id ? { ...a, isVIP: true, vipPending: false } : a
        ));
        alert(`تم قبول طلب VIP للحرفي ذو المعرف: ${id}`);
    };

    // **وظيفة محاكاة لحذف الحساب (في التطبيق الحقيقي، يتم تحديث Firestore)**
    const handleDeleteAccount = async (id) => {
        if (window.confirm(`هل أنت متأكد من حذف حساب الحرفي ذو المعرف: ${id}؟`)) {
            // await deleteDoc(doc(db, "artisans", id));
            setArtisans(artisans.filter(a => a.id !== id));
        }
    };
    
    // إحصائيات سريعة
    const totalArtisans = artisans.length;
    const activeArtisans = artisans.filter(a => a.status === 'active').length;
    const pendingVIP = artisans.filter(a => a.vipPending).length;

    if (loading) return <div className="text-center p-8">...جاري تحميل لوحة التحكم</div>;

    return (
        <div className="container mx-auto p-4 md:p-10">
            <h1 className="text-3xl font-bold text-center text-red-700 mb-8">🛡️ لوحة التحكم الإدارية (Admin)</h1>
            
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="إجمالي الحرفيين" value={totalArtisans} bgColor="bg-blue-100" />
                <StatCard title="حسابات نشطة" value={activeArtisans} bgColor="bg-green-100" />
                <StatCard title="طلبات VIP جديدة" value={pendingVIP} bgColor="bg-yellow-100" />
            </div>

            {/* جدول إدارة الحرفيين */}
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">قائمة الحرفيين المسجلين</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">الاسم</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">المهنة</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">الحالة</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">VIP</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {artisans.map((artisan) => (
                            <tr key={artisan.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{artisan.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{artisan.profession}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={artisan.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {artisan.isVIP ? '✅ نعم' : '❌ لا'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex justify-end">
                                    
                                    {artisan.vipPending && (
                                        <button 
                                            onClick={() => handleAcceptVIP(artisan.id)}
                                            className="text-xs bg-yellow-500 text-white hover:bg-yellow-600 p-1 rounded transition"
                                        >
                                            قبول VIP
                                        </button>
                                    )}

                                    <button 
                                        onClick={() => handleDeleteAccount(artisan.id)}
                                        className="text-xs bg-red-500 text-white hover:bg-red-600 p-1 rounded transition"
                                    >
                                        حذف
                                    </button>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

// مكون مساعد لبطاقات الإحصائيات
const StatCard = ({ title, value, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-md text-center border border-gray-200`}>
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <p className="text-4xl font-extrabold text-gray-800">{value}</p>
    </div>
);

// مكون مساعد لشارة الحالة
const StatusBadge = ({ status }) => {
    let colorClass;
    let text;
    switch (status) {
        case 'active':
            colorClass = 'bg-green-100 text-green-800';
            text = 'نشط';
            break;
        case 'pending':
            colorClass = 'bg-yellow-100 text-yellow-800';
            text = 'قيد المراجعة';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800';
            text = 'غير معروف';
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {text}
        </span>
    );
};

export default AdminDashboard;
