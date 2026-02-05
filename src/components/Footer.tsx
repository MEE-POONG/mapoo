export default function Footer() {
    return (
        <footer className="bg-brand-50 border-t border-brand-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center text-white font-bold font-serif">S</div>
                        <span className="font-bold text-xl text-brand-800">SiamSausage</span>
                    </div>
                    <div className="flex space-x-6 text-brand-500">
                        <a href="#" className="hover:text-brand-800 transition-colors">หน้าแรก</a>
                        <a href="#" className="hover:text-brand-800 transition-colors">สินค้า</a>
                        <a href="#" className="hover:text-brand-800 transition-colors">แจ้งชำระเงิน</a>
                        <a href="#" className="hover:text-brand-800 transition-colors">ติดต่อเรา</a>
                    </div>
                </div>
                <div className="text-center text-brand-400 text-sm">
                    &copy; 2024 SiamSausage. สงวนลิขสิทธิ์. ออกแบบเพื่อการสาธิตเท่านั้น
                </div>
            </div>
        </footer>
    );
}
