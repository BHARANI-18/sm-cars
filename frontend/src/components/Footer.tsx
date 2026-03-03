export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-2">&copy; {new Date().getFullYear()} SM Motors. All rights reserved.</p>
                <p className="text-sm">Providing premium cars for exceptional journeys.</p>
            </div>
        </footer>
    );
}
