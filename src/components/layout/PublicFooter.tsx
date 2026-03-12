import Link from "next/link";
import Image from "next/image";

export function PublicFooter() {
    return (
        <footer id="contact" className="w-full border-t border-border-soft bg-white px-6 py-16">
            <div className="mx-auto max-w-6xl grid gap-12 sm:grid-cols-2 md:grid-cols-4">
                <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2">
                        <Image src="/icon.png" alt="Mirror Logo" width={32} height={32} className="rounded-lg shadow-sm" />
                        <h3 className="text-xl font-black text-primary-dark">Mirror</h3>
                    </div>
                    <p className="text-[15px] font-medium text-secondary-text max-w-xs">
                        Tu asistente inteligente para dominar el networking en LinkedIn. Construye relaciones que importan.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-primary-dark uppercase tracking-wider">Producto</h4>
                    <ul className="space-y-3">
                        <li><Link href="#features" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">Features</Link></li>
                        <li><Link href="#pricing" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">Pricing</Link></li>
                        <li><Link href="#faq" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">FAQ</Link></li>
                    </ul>
                </div>
                
                <div className="space-y-4">
                    <h4 className="text-[14px] font-bold text-primary-dark uppercase tracking-wider">Contacto</h4>
                    <ul className="space-y-3">
                        <li><a href="mailto:soporte@mirror.com" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">soporte@mirror.com</a></li>
                        <li><a href="#" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">Centro de ayuda</a></li>
                        <li><a href="#" className="text-[14px] font-medium text-secondary-text hover:text-accent-blue transition-colors">Términos legales</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="mx-auto max-w-6xl mt-16 pt-8 border-t border-border-soft flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[13px] font-medium text-muted-text">
                    © {new Date().getFullYear()} Mirror. Todos los derechos reservados.
                </p>
                <div className="flex gap-4">
                    {/* Social icons could go here */}
                    <div className="h-4 w-4 rounded-full bg-border-soft"></div>
                    <div className="h-4 w-4 rounded-full bg-border-soft"></div>
                    <div className="h-4 w-4 rounded-full bg-border-soft"></div>
                </div>
            </div>
        </footer>
    );
}
