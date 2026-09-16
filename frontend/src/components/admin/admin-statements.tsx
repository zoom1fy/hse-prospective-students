"use client";

import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { getAdminStatements, getStatementStatuses, updateAdminStatement } from "@/lib/api/admin";
import type { ApiAdminStatement, ApiReference } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export function AdminStatements() {
  const [statements, setStatements] = useState<ApiAdminStatement[]>([]);
  const [statuses, setStatuses] = useState<ApiReference[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [loadedStatements, loadedStatuses] = await Promise.all([
          getAdminStatements(),
          getStatementStatuses(),
        ]);
        if (cancelled) return;
        setStatements(loadedStatements);
        setStatuses(loadedStatuses);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const filtered = statusFilter
    ? statements.filter((statement) => statement.id_status === Number(statusFilter))
    : statements;

  async function changeStatus(statement: ApiAdminStatement, idStatus: number) {
    setSavingId(statement.id);
    setError("");
    try {
      await updateAdminStatement(statement.id, idStatus);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось изменить статус");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Админ-панель"
        title="Заявки"
        description="Все заявления абитуриентов. Можно менять статус обработки."
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="max-w-xs"
        >
          <option value="">Все статусы</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </Select>
        <span className="text-muted ml-auto text-sm">Всего: {filtered.length}</span>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      ) : null}

      {state === "loading" ? (
        <div className="border-border bg-surface text-muted mt-6 rounded-xl border p-6 text-sm">
          Загрузка…
        </div>
      ) : null}

      {state === "error" ? (
        <div className="border-border text-muted mt-6 rounded-xl border border-dashed p-12 text-center text-sm">
          Не удалось загрузить заявки.
        </div>
      ) : null}

      {state === "ready" ? (
        <Card className="mt-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-200 border-collapse text-sm">
                <thead>
                  <tr className="border-border text-muted border-b text-left">
                    <th className="px-4 py-3 font-medium">№</th>
                    <th className="px-4 py-3 font-medium">Абитуриент</th>
                    <th className="px-4 py-3 font-medium">Программа</th>
                    <th className="px-4 py-3 font-medium">Дата</th>
                    <th className="px-4 py-3 font-medium">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((statement) => (
                    <tr key={statement.id} className="border-border hover:bg-surface-muted/40 border-b">
                      <td className="text-muted px-4 py-3">{statement.id}</td>
                      <td className="px-4 py-3 font-medium">{statement.user_name || "—"}</td>
                      <td className="px-4 py-3">{statement.program_name || "—"}</td>
                      <td className="text-muted px-4 py-3">{formatDate(statement.created_at)}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={String(statement.id_status)}
                          disabled={savingId === statement.id}
                          onChange={(event) => changeStatus(statement, Number(event.target.value))}
                          className="max-w-56"
                        >
                          {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
