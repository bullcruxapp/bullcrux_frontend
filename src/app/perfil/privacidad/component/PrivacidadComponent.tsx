'use client'
import { useRouter } from 'next/navigation';
import './privacidad-component.css';

const PrivacidadComponent = () => {
    const router = useRouter();

    return (
        <div className="privacidad-container">
            <div className="privacidad-header">
                <button className="privacidad-back-button" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="privacidad-title">Política de privacidad</h1>
                <div style={{ width: '24px' }} />
            </div>

            <div className="privacidad-content">
                <p className="privacidad-date">Última actualización: Junio 2026</p>

                <h2>1. Introducción</h2>
                <p>BullCrux es una plataforma que permite a los usuarios adquirir unidades digitales de uso interno denominadas "$COINS", las cuales pueden utilizarse exclusivamente dentro de la plataforma para obtener participaciones en los sorteos disponibles. Los $COINS no constituyen moneda de curso legal, instrumento financiero, valor negociable, criptoactivo ni medio de inversión.</p>
                <p>BullCrux es una plataforma digital operada por su titular. Los datos de contacto se indican al final de esta política.</p>

                <h2>2. Base legal del tratamiento</h2>
                <p>El tratamiento de los datos personales se realiza con el consentimiento del usuario y en la medida necesaria para prestar los servicios ofrecidos por BullCrux y cumplir con las obligaciones legales aplicables.</p>

                <h2>3. Datos que recopilamos</h2>
                <p>Al registrarte o usar BullCrux, recopilamos los siguientes datos:</p>
                <p><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico e imagen de perfil. Los datos obtenidos mediante el inicio de sesión con Google serán únicamente aquellos autorizados por el usuario durante el proceso de autenticación.</p>
                <p><strong>Historial de transacciones:</strong> compras de $COINS y participaciones en sorteos.</p>
                <p><strong>Información técnica:</strong> también podremos recopilar información técnica del dispositivo, dirección IP, navegador, identificadores de sesión y registros de actividad necesarios para el funcionamiento y la seguridad de la plataforma.</p>

                <h2>4. Cómo usamos tus datos</h2>
                <p>Los datos recopilados se utilizan para crear y gestionar tu cuenta, procesar la adquisición de $COINS, registrar tus participaciones, contactarte en caso de ser ganador y mejorar la experiencia de uso de la plataforma.</p>
                <p><strong>Prevención de fraude:</strong> BullCrux podrá analizar información de uso, dispositivos, direcciones IP y patrones de comportamiento con el fin de detectar fraudes, cuentas duplicadas, automatizaciones o cualquier actividad que pueda afectar la integridad de la plataforma.</p>

                <h2>5. Compartir datos con terceros</h2>
                <p>BullCrux utiliza los siguientes servicios de terceros: <strong>Google OAuth</strong> para autenticación, <strong>MercadoPago</strong> para el procesamiento de pagos (BullCrux no almacena datos completos de tarjetas de crédito o débito; el procesamiento es realizado directamente por MercadoPago conforme a sus propias políticas), y <strong>Supabase</strong> como proveedor de base de datos.</p>
                <p>BullCrux no vende, alquila ni comparte tus datos personales con terceros con fines publicitarios o comerciales.</p>

                <h2>6. Transferencias internacionales</h2>
                <p>Algunos proveedores tecnológicos utilizados por BullCrux pueden almacenar o procesar información fuera de Argentina. En tales casos se procurará que dichos proveedores mantengan estándares adecuados de protección de datos.</p>

                <h2>7. Cookies y tecnologías similares</h2>
                <p>BullCrux utiliza cookies y tecnologías similares para mantener la sesión iniciada, mejorar el funcionamiento del sitio y realizar mediciones básicas de uso.</p>

                <h2>8. Retención de datos</h2>
                <p>Tus datos se conservan mientras tu cuenta esté activa. Algunos datos podrán conservarse incluso después de la eliminación de la cuenta cuando exista una obligación legal o resulte necesario para prevenir fraudes, resolver disputas o cumplir requerimientos de autoridades competentes.</p>
                <p>Para solicitar la eliminación de tu cuenta, escribinos a <strong>bullcruxapp@gmail.com</strong>.</p>

                <h2>9. Seguridad</h2>
                <p>BullCrux implementa medidas de seguridad técnicas para proteger tus datos, incluyendo comunicaciones cifradas mediante HTTPS y autenticación segura mediante tokens JWT.</p>

                <h2>10. Tus derechos</h2>
                <p>Tenés derecho a acceder, corregir o solicitar la eliminación de tus datos personales, y a revocar tu consentimiento en cualquier momento. Para ejercer estos derechos, contactanos en <strong>bullcruxapp@gmail.com</strong>.</p>

                <h2>11. Menores de edad</h2>
                <p>BullCrux no está dirigido a personas menores de 18 años. Si sos menor de edad, no debés registrarte ni usar la plataforma.</p>

                <h2>12. Cambios en esta política</h2>
                <p>BullCrux se reserva el derecho de actualizar esta política en cualquier momento. Los cambios serán notificados a través de la plataforma o por correo electrónico.</p>

                <h2>13. Contacto</h2>
                <p><strong>bullcruxapp@gmail.com</strong></p>
            </div>
        </div>
    );
};

export default PrivacidadComponent;
