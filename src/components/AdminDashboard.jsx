// src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { db } from '../firebase/config'; 

// لوحة تحكم بسيطة تتطلب تصفح جميع الحرفيين لإدارة الحسابات
const AdminDashboard = () => {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // دالة لجلب جميع الحرفيين
    const fetchArtisans = async () => {
        setLoading(true);
        setError(null);
        try {
            // جلب جميع الوثائق في مجموعة artisans
            const q = collection(db, "artisans");
            const querySnapshot = await getDocs(q);
            
            const fetchedArtisans = querySnapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                // تحويل تاريخ VIP من Firebase Timestamp إلى كائن تاريخ JavaScript إذا كان موجوداً
                vipSubscriptionEndDate: doc.data().vipSubscriptionEndDate?.toDate ? doc.data().vipSubscriptionEndDate.toDate() : doc.data().vipSubscriptionEndDate
            }));
            
            setArtisans(fetchedArtisans);
        } catch (err) {
            console.error("Error fetching artisans: ", err);
            setError("فشل في جلب بيانات الحرفيين من قاعدة البيانات.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtisans();
    }, []);

    // **وظيفة قبول أو رفض VIP (تحديث Firestore)**
    const handleToggleVIP = async (id, currentStatus) => {
        const confirmMsg = currentStatus 
            ? "هل أنت متأكد من إلغاء اشتراك VIP لهذا الحرفي؟"
            : "هل أنت متأكد من قبول وتفعيل اشتراك VIP لهذا الحرفي لمدة سنة؟";

        if (!window.confirm(confirmMsg)) return;

        try {
            const artisanRef = doc(db, "artisans", id);
            
            const newVIPStatus = !currentStatus;
            let updatePayload = { 
                isVIP: newVIPStatus, 
                // افتراض أن طلب VIP ليس قيد المراجعة بعد التفاعل معه
                vipPending: false 
            };
            
            if (newVIPStatus) {
                // تفعيل لمدة 12 شهرًا من الآن
                const expiryDate = new Date();
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                updatePayload.vipSubscriptionEndDate = expiryDate;
            } else {
                updatePayload.vipSubscriptionEndDate = null;
            }

            await updateDoc(artisanRef, updatePayload);
            
            // تحديث الواجهة (بدون إعادة جلب البيانات بالكامل)
            setArtisans(artisans.map(a => 
                a.id === id ? { ...a, ...updatePayload } : a
            ));
            alert(`تم ${newVIPStatus ? 'تفعيل' : 'إلغاء'} حالة VIP بنجاح.`);

        } catch (err) {
            console.error("Error updating VIP status:", err);
            alert("فشل في تحديث حالة VIP.");
        }
    };

    // **وظيفة حذف الحساب (تحديث Firestore)**
    const handleDeleteAccount = async (id) => {
        if (!window.confirm(`هل أنت متأكد من حذف حساب الحرفي ذو المعرف: ${id}؟ لن يمكن التراجع عن هذا الإجراء.`)) return;

        try {
            // حذف الوثيقة من Firestore
            await deleteDoc(doc(db, "artisans", id));
            
            // تحديث الواجهة
            setArtisans(artisans.filter(a => a.id !== id));
            alert(`تم حذف حساب الحرفي ذو المعرف: ${id} بنجاح.`);
            
        } catch (err) {
            console.error("Error deleting document:", err);
            alert("فشل في حذف الحساب.");
        }
    };
    
    // إحصائيات سريعة
    const totalArtisans = artisans.length;
    const activeArtisans = artisans.filter(a => a.status === 'active').length;
    const pendingVIP = artisans.filter(a => a.vipPending).length;

    if (loading) return <div className="text-center p-8 text-lg">...جاري تحميل لوحة التحكم</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100">{error}</div>;

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
                                    {artisan.vipPending && <span className="text-xs text-yellow-600 ml-2">(طلب)</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex justify-end">
                                    
                                    {/* زر تفعيل/إلغاء VIP */}
                                    <button 
                                        onClick={() => handleToggleVIP(artisan.id, artisan.isVIP)}
                                        className={`text-xs p-1 rounded transition ${artisan.isVIP ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                    >
                                        {artisan.isVIP ? 'إلغاء VIP' : 'تفعيل VIP'}
                                    </button>

                                    {/* زر الحذف */}
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
            colorClass = 'bg-red-100 text-red-800';
            text = 'معطل';
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {text}
        </span>
    );
};

export default AdminDashboard;
