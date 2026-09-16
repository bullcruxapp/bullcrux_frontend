'use client'
import { useRouter } from 'next/navigation';
import './terminos-component.css';

const TerminosComponent = () => {
    const router = useRouter();

    return (
        <div className="terminos-container">
            <div className="terminos-header">
                <button className="terminos-back-button" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="terminos-title">Términos y condiciones</h1>
                <div style={{ width: '24px' }} />
            </div>

            <div className="terminos-content">
                <p className="privacidad-date">Última actualización: Septiembre 2026</p>

                <h2>1. Aceptación de los términos</h2>
                <p>Al registrarte o usar BullCrux, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguno de sus puntos, no debés usar la plataforma.</p>

                <h2>2. Qué es BullCrux</h2>
                <p>BullCrux es una plataforma que permite a los usuarios adquirir unidades digitales de uso interno denominadas "$BULL", las cuales pueden utilizarse exclusivamente dentro de la plataforma para obtener participaciones en los sorteos disponibles. Los $BULL no constituyen moneda de curso legal, instrumento financiero, valor negociable, criptoactivo ni medio de inversión, y no tienen valor de canje fuera de BullCrux.</p>

                <h2>3. Registro y elegibilidad</h2>
                <p>Para usar BullCrux tenés que ser mayor de 18 años y registrarte con información veraz y actualizada. Cada persona puede tener una única cuenta; BullCrux se reserva el derecho de suspender o eliminar cuentas duplicadas, falsas o que incumplan estos términos.</p>
                <p>Sos responsable de mantener la confidencialidad de tus credenciales de acceso y de toda actividad que ocurra en tu cuenta.</p>

                <h2>4. Compra de $BULL</h2>
                <p>Los $BULL se adquieren a través de los medios de pago habilitados en la plataforma (actualmente, MercadoPago). Los precios se muestran en la moneda indicada al momento de la compra y pueden modificarse sin previo aviso para compras futuras.</p>
                <p>Las compras de $BULL son, por su naturaleza de unidad digital de uso interno ya acreditada, definitivas y no reembolsables, salvo en los casos en que la normativa vigente exija lo contrario o ante un error comprobado de BullCrux.</p>

                <h2>5. Participaciones y sorteos</h2>
                <p>Podés obtener participaciones de dos formas: comprándolas con $BULL, o de forma gratuita completando la cantidad de anuncios que la plataforma indique en cada sorteo. La participación gratuita está limitada a una vez por sorteo por usuario.</p>
                <p>Cada participación recibe un código numérico asignado de forma aleatoria, único dentro de ese sorteo. Este código es tu comprobante de participación y se te informa dentro de la plataforma y por correo electrónico.</p>
                <p>BullCrux se reserva el derecho de anular participaciones obtenidas mediante fraude, manipulación, uso de bots o cualquier otro medio que vulnere la integridad del sorteo.</p>

                <h2>6. Selección de ganadores y entrega de premios</h2>
                <p>El ganador de cada sorteo se determina por sorteo aleatorio entre los códigos de participación válidos, una vez alcanzada la condición de cierre del sorteo correspondiente.</p>
                <p>Si tu código resulta ganador, te contactaremos por correo electrónico dentro de las 48 horas posteriores al sorteo para coordinar la entrega del premio. Es tu responsabilidad responder a ese contacto y proveer la información necesaria para la entrega; BullCrux no se hace responsable por premios no reclamados debido a datos de contacto desactualizados o falta de respuesta del ganador.</p>

                <h2>7. Uso prohibido de la plataforma</h2>
                <p>No está permitido: crear múltiples cuentas para eludir límites de participación, usar bots, scripts o automatizaciones, intentar acceder a cuentas ajenas, manipular el resultado de los sorteos, ni realizar cualquier actividad que afecte la seguridad o integridad de BullCrux. El incumplimiento puede derivar en la suspensión o eliminación de la cuenta y la anulación de las participaciones obtenidas de forma irregular.</p>

                <h2>8. Publicidad y ticket gratis</h2>
                <p>Para obtener una participación gratuita, es necesario ver la cantidad de anuncios indicada en la plataforma hasta su finalización. El sistema registra automáticamente la visualización completa de cada anuncio; intentar sortear o falsificar este proceso constituye una infracción a estos términos.</p>

                <h2>9. Propiedad intelectual</h2>
                <p>Todos los contenidos de BullCrux (marca, diseño, textos, software) son propiedad de BullCrux o de sus licenciantes. No está permitido reproducir, copiar o distribuir estos contenidos sin autorización previa.</p>

                <h2>10. Limitación de responsabilidad</h2>
                <p>BullCrux pone a disposición la plataforma "tal cual" está. No garantizamos que el servicio esté libre de interrupciones o errores. En la medida permitida por la ley aplicable, BullCrux no será responsable por daños indirectos derivados del uso de la plataforma.</p>
                <p>Los productos sorteados se entregan según su estado y condiciones al momento del sorteo; cualquier información sobre el producto ofrecida en la publicación es a título informativo.</p>

                <h2>11. Suspensión y cancelación de cuentas</h2>
                <p>BullCrux puede suspender o cancelar tu cuenta ante el incumplimiento de estos términos, actividad fraudulenta o a solicitud del propio usuario. Podés solicitar la eliminación de tu cuenta escribiendo a <strong>bullcruxapp@gmail.com</strong>.</p>

                <h2>12. Modificaciones a estos términos</h2>
                <p>BullCrux se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la plataforma o por correo electrónico, y el uso continuado del servicio implica su aceptación.</p>

                <h2>13. Ley aplicable</h2>
                <p>Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia derivada de su interpretación o cumplimiento se someterá a los tribunales competentes de Argentina.</p>

                <h2>14. Contacto</h2>
                <p><strong>bullcruxapp@gmail.com</strong></p>
            </div>
        </div>
    );
};

export default TerminosComponent;
