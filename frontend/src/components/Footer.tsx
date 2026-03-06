export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-white font-bold text-lg mb-1">SM Cars</p>
                <a href="tel:9543182448" className="text-green-400 hover:text-green-300 font-semibold text-sm mb-3 inline-block transition">
                    📞 9543182448
                </a>
                <p className="text-xs mb-1">© {new Date().getFullYear()} SM Cars. All rights reserved.</p>
                <p className="text-xs">Providing premium cars for exceptional journeys.</p>
            </div>
        </footer>
    );
}
