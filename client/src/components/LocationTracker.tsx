import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LocationTrackerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle: string;
}

function generateTamilNaduCoordinate() {
  const latitude = 8.0 + Math.random() * 5.5; // 8.000 – 13.500
  const longitude = 76.0 + Math.random() * 4.0; // 76.000 – 80.000
  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
    timestamp: new Date().toLocaleTimeString(),
  };
}

export default function LocationTracker({ open, onOpenChange, orderId, orderTitle }: LocationTrackerProps) {
  const [running, setRunning] = useState(true);
  const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number; timestamp: string }>>([]);
  const intervalRef = useRef<number | null>(null);

  // Start/stop generation based on dialog open and running state
  useEffect(() => {
    if (!open) {
      // Clear state when closed
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCoordinates([]);
      return;
    }

    if (running && !intervalRef.current) {
      // Push an initial coordinate immediately
      setCoordinates((prev) => [generateTamilNaduCoordinate(), ...prev].slice(0, 20));
      intervalRef.current = window.setInterval(() => {
        setCoordinates((prev) => [generateTamilNaduCoordinate(), ...prev].slice(0, 20));
      }, 3000);
    }

    if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open, running]);

  const current = coordinates[0] || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tracking Order #{orderId}</DialogTitle>
          <DialogDescription>
            {orderTitle} — live location updates inside Tamil Nadu bounds (lat 8.0–13.5, lon 76.0–80.0).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {current ? (
              <div className="text-sm">
                <div>
                  <span className="font-medium">Latitude:</span> {current.latitude.toFixed(6)}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span> {current.longitude.toFixed(6)}
                </div>
                <div className="text-muted-foreground text-xs">Updated: {current.timestamp}</div>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">Initializing coordinates…</div>
            )}

            <div className="flex gap-2">
              {running ? (
                <Button variant="outline" onClick={() => setRunning(false)}>Pause</Button>
              ) : (
                <Button onClick={() => setRunning(true)}>Resume</Button>
              )}
              <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[480px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinates.map((c, idx) => (
                  <TableRow key={`${c.timestamp}-${idx}`}>
                    <TableCell>{c.timestamp}</TableCell>
                    <TableCell>{c.latitude.toFixed(6)}</TableCell>
                    <TableCell>{c.longitude.toFixed(6)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}