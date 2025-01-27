import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DangerZoneProps {
  isLoading: boolean;
  onDeleteAccount: () => Promise<void>;
}

export function DangerZone({ isLoading, onDeleteAccount }: DangerZoneProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-zinc-400">
              Permanently delete your account and all associated data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={isLoading}
              className="bg-red-500/10 border border-red-500/20 text-red-400 
                       hover:bg-red-500/20 hover:text-red-300 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </div>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-zinc-900 border border-zinc-800">
            <AlertDialogHeader>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <AlertDialogTitle className="text-lg font-medium text-zinc-100">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    This action cannot be undone. This will permanently delete your account and
                    remove all associated data from our servers.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-transparent border border-zinc-800 text-zinc-300 
                                        hover:bg-zinc-800 hover:text-white transition-all duration-200"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteAccount}
                className="bg-red-500/10 border border-red-500/20 text-red-400 
                         hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
