import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { doc, getDoc } from 'firebase/firestore'; // استيراد وظائف Firebase

const ArtisanDetails = () => {
    const { id } = useParams(); // الحصول على معرّف الحرفي من الرابط
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // **وظيفة جلب البيانات من Firebase**
        const fetchArtisan = async () => {
            // مثال على جلب البيانات (يجب ربطها بـ Firestore)
            /* const docRef = doc(db, "artisans", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setArtisan(docSnap.data());
            } else {
                console.log("No such artisan!");
            }
            */

            // **بيانات محاكاة مؤقتة:**
            setArtisan({
                fullName: "محمد أمين قاسمي",
                profession: "نجار",
                phoneNumber: "0550123456",
                wilaya: "الجزائر",
                baladiya: "القبة",
                experienceYears: 15,
                bio: "متخصص في صناعة الأبواب والنوافذ الخشبية بأحدث التصاميم.",
                isVIP: true,
                workImagesUrls: [
                    'https://via.placeholder.com/300x200?text=Work+1',
                    'https://via.placeholder.com/300x200?text=Work+2',
                    'https://via.placeholder.com/300x200?text=Work+3',
                ],
            });

            setLoading(false);
        };

        fetchArtisan();
    }, [id]);

    if (loading) {
        return <div className="text-center p-8 text-lg">...جاري تحميل تفاصيل الحرفي</div>;
    }

    if (!artisan) {
        return <div className="text-center p-8 text-red-500">عذراً، لم يتم العثور على هذا الحرفي.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                {/* معلومات أساسية */}
                <div className="p-6 md:flex md:items-center">
                    <div className="md:w-1/4 flex justify-center md:justify-start">
                        {/*  */}
                        <img 
                            className="h-32 w-32 object-cover rounded-full border-4 border-blue-500"
                            src={artisan.profilePictureUrl || 'https://via.placeholder.com/150?text=Profile'} 
                            alt={artisan.fullName}
                        />
                    </div>
                    <div className="md:w-3/4 md:pr-6 mt-4 md:mt-0 text-center md:text-right">
                        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center md:justify-end">
                            {artisan.fullName} 
                            {artisan.isVIP && (
                                <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2 shadow-md">
                                    VIP ⭐
                                </span>
                            )}
                        </h1>
                        <p className="text-xl text-blue-600 mt-1">{artisan.profession}</p>
                        <p className="text-gray-600 mt-2">
                            <span className="font-semibold">الموقع:</span> {artisan.baladiya}, {artisan.wilaya}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">سنوات الخبرة:</span> {artisan.experienceYears} سنة
                        </p>
                    </div>
                </div>

                {/* النبذة والاتصال */}
                <div className="border-t p-6 bg-gray-50">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-1">نبذة عن الحرفي</h2>
                    <p className="text-gray-700 leading-relaxed text-justify">
                        {artisan.bio}
                    </p>
                    
                    <div className="mt-4 text-center">
                        <a 
                            href={`tel:${artisan.phoneNumber}`} 
                            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
                        >
                            📞 اتصل الآن: {artisan.phoneNumber}
                        </a>
                    </div>
                </div>

                {/* معرض الأعمال */}
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-1">معرض الأعمال</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {artisan.workImagesUrls.map((url, index) => (
                            <img 
                                key={index} 
                                className="w-full h-48 object-cover rounded-md shadow-md hover:shadow-lg transition duration-300"
                                src={url} 
                                alt={`Work ${index + 1}`} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ArtisanDetails;
