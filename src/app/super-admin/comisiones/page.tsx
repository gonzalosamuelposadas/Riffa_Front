"use client";

import { useEffect, useState } from "react";
import { DollarSign, CheckCircle } from "lucide-react";
import { api } from "@shared";
import toast from "react-hot-toast";

interface CommissionByStore {
  id: string;
  name: string;
  slug: string;
  owner: { name: string; email: string };
  pendingCommission: number;
  commissionCount: number;
}

export default function ComisionesPage() {
  const [commissions, setCommissions] = useState<CommissionByStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  const fetchCommissions = async () => {
    try {
      const { data } = await api.get<CommissionByStore[]>(
        "/super-admin/commissions/by-store",
      );
      setCommissions(data);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleMarkAsPaid = async (storeId: string) => {
    if (!confirm("¿Marcar todas las comisiones de esta tienda como pagadas?")) {
      return;
    }

    setMarking(storeId);
    try {
      await api.patch(`/super-admin/commissions/${storeId}/pay`, {});
      toast.success("Comisiones marcadas como pagadas");
      fetchCommissions();
    } catch {
      toast.error("Error al marcar comisiones");
    } finally {
      setMarking(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const totalPending = commissions.reduce(
    (sum, c) => sum + c.pendingCommission,
    0,
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Comisiones
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Gestiona las comisiones pendientes de pago (5% por venta)
        </p>
      </div>

      {/* Total Summary */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
            <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Total por cobrar
            </p>
            <p className="text-3xl font-bold text-amber-800 dark:text-amber-200">
              {formatCurrency(totalPending)}
            </p>
          </div>
        </div>
      </div>

      {commissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            Sin comisiones pendientes
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Todas las comisiones han sido cobradas
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {commissions.map((store) => (
              <div
                key={store.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {store.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {store.owner.name} • {store.commissionCount} ventas
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(store.pendingCommission)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkAsPaid(store.id)}
                    disabled={marking === store.id}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {marking === store.id ? "Marcando..." : "Marcar Pagado"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
