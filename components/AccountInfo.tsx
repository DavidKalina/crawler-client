import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountInfoProps {
  fullName: string;
  companyName?: string | null;
  email: string;
}

export function AccountInfo({ fullName, companyName, email }: AccountInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <p className="text-sm text-muted-foreground">{fullName}</p>
          </div>
          {companyName && (
            <div>
              <label className="text-sm font-medium">Company</label>
              <p className="text-sm text-muted-foreground">{companyName}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
