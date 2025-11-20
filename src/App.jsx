import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArtisanSearch from './components/ArtisanSearch';
import ArtisanDetails from './components/ArtisanDetails';
import ArtisanRegistrationForm from './components/ArtisanRegistrationForm';
import ArtisanLogin from './components/ArtisanLogin';
import AdminDashboard from './components/AdminDashboard';

// **المكون الخاص بالصفحة الرئيسية (Homepage)**
const HomePage = () => (
    <div className="text-center">
        {/* شريط الأبطال (Hero Section) مع صورة ورشة العمل */}
        <div className="relative bg-gray-900 text-white pt-20 pb-20 overflow-hidden">
            {/* [attachment_0](attachment) */}
            <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{backgroundImage: "url('https://via.placeholder.com/1500x700?text=Artisan+Workshop+Image')"}}></div>
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
                    ARTIZONE: نربطك بالحرفي المناسب
                </h2>
                <p className="text-xl md:text-2xl mb-8 font-light">
                    ابحث عن أمهر الحرفيين الجزائريين الموثوقين في جميع التخصصات والولايات.
                </p>
                <Link to="/search" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105">
                    🔍 ابدأ البحث الآن
                </Link>
            </div>
        </div>

        {/* قسم المزايا (Features Section) */}
        <div className="py-16 bg-gray-50">
            <h3 className="text-3xl font-bold text-gray-800 mb-10">لماذا تختار ARTIZONE؟</h3>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                <FeatureCard title="موثوقية عالية" icon="✅" description="جميع الحرفيين مسجلين وموثقين عبر الإدارة المركزية." />
                <FeatureCard title="بحث دقيق" icon="📍" description="ابحث حسب الولاية، البلدية، والتخصص بسهولة وفاعلية." />
                <FeatureCard title="دعم VIP" icon="⭐" description="حسابات مميزة تضمن ظهوراً أكبر لأصحاب الجودة والخبرة." />
            </div>
        </div>
        
        {/* قسم الانضمام للحرفيين */}
        <div className="py-16 bg-blue-600 text-white">
            <h3 className="text-3xl font-bold mb-4">هل أنت حرفي؟</h3>
            <p className="text-xl mb-6">انضم إلى شبكة ARTIZONE وعرض أعمالك لمئات الباحثين يوميًا.</p>
            <Link to="/register" className="inline-block bg-white hover:bg-gray-200 text-blue-600 font-bold py-3 px-8 rounded-full text-lg shadow-xl transition duration-300">
                تسجيل حساب جديد
            </Link>
        </div>
    </div>
);

// مكون مساعد لبطاقة المزايا
const FeatureCard = ({ title, icon, description }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <div className="text-4xl mb-4">{icon}</div>
        <h4 className="text-xl font-semibold mb-2 text-gray-800">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
);


// **المكون الرئيسي لتطبيق React**
const App = () => {
    return (
        <Router>
            <Header /> {/* مكون الشريط العلوي (Navbar) */}
            <main className="min-h-screen pt-16"> 
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<ArtisanSearch />} />
                    <Route path="/artisan/:id" element={<ArtisanDetails />} />
                    <Route path="/register" element={<ArtisanRegistrationForm />} />
                    <Route path="/login" element={<ArtisanLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

// مكون الشريط العلوي
const Header = () => (
    <header className="bg-white shadow-md fixed w-full z-20">
        <nav className="container mx-auto p-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
                <Link to="/">ARTIZONE 🇩🇿</Link>
            </div>
            <div className="space-x-4 space-x-reverse">
                <Link to="/search" className="text-gray-600 hover:text-blue-600 transition">البحث</Link>
                <Link to="/register" className="text-gray-600 hover:text-blue-600 transition">تسجيل حرفي</Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-md">دخول الحرفيين</Link>
            </div>
        </nav>
    </header>
);

// مكون التذييل
const Footer = () => (
    <footer className="bg-gray-800 text-white p-6 mt-8">
        <div className="container mx-auto text-center text-sm">
            <p>&copy; {new Date().getFullYear()} ARTIZONE. كل الحقوق محفوظة.</p>
        </div>
    </footer>
);

export default App;
