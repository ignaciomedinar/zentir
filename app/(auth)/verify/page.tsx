import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-4xl mb-2">📩</div>
          <CardTitle className="text-2xl text-stone-800">Revisá tu email</CardTitle>
          <CardDescription>
            Te enviamos un link de confirmación. Hacé click en el link para activar tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-stone-500">
            Si no lo ves en tu bandeja de entrada, revisá la carpeta de spam.
          </p>
          <ButtonLink variant="outline" href="/login">Volver al inicio de sesión</ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
