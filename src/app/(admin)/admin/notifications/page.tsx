"use client";

import React, { useState } from "react";
import { Bell, ShieldCheck, CheckCircle2, AlertTriangle, Info, Clock, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  createdAt: string;
  isRead: boolean;
}

interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  ipAddress: string;
  status: "SUCCESS" | "FAILURE";
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-01",
      title: "MRI Sync Batch Completed",
      message: "Synchronized 5 properties, 12 photos, and 3 open home inspection schedules from MRI Vault.",
      type: "SUCCESS",
      createdAt: "2026-08-22 21:00",
      isRead: false,
    },
    {
      id: "notif-02",
      title: "Urgent Appraisal Request Received",
      message: "New seller appraisal request for 88 Ocean Drive, Bondi Beach NSW.",
      type: "WARNING",
      createdAt: "2026-08-22 16:15",
      isRead: false,
    },
    {
      id: "notif-[#",
      title: "Australian Privacy Act Data Export Requested",
      message: "Customer James Harrison requested a complete JSON data export archive.",
      type: "INFO",
      createdAt: "2026-08-21 14:00",
      isRead: true,
    },
  ]);

  const [auditLogs] = useState<AuditLogItem[]>([
    {
      id: "log-101",
      timestamp: "2026-08-22 21:02:14",
      userName: "Marcus Vance",
      userRole: "AGENT",
      action: "PROPERTY_WEBSITE_OVERRIDE_UPDATE",
      entity: "Property: mri-vlt-1001",
      ipAddress: "203.111.42.18",
      status: "SUCCESS",
    },
    {
      id: "log-102",
      timestamp: "2026-08-22 19:30:00",
      userName: "System Automation",
      userRole: "SYSTEM",
      action: "MRI_VAULT_FULL_SYNC",
      entity: "SyncJob: sj-9982",
      ipAddress: "127.0.0.1",
      status: "SUCCESS",
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0a192f]">
              Notifications & Security Audit Center
            </h1>
            <Badge variant="gold">Section 57 & 121 Compliant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            System notifications, integration alerts, and immutable security audit logs for platform compliance.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Mark All Notifications as Read</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Notifications List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Alert Notifications</span>
                <Badge variant="gold">
                  {notifications.filter((n) => !n.isRead).length} Unread
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    !n.isRead ? "bg-amber-50/50 border-amber-200" : "bg-slate-50 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <Badge variant={n.type === "SUCCESS" ? "success" : n.type === "WARNING" ? "warning" : "outline"}>
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-mono pt-1">{n.createdAt}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Security Audit Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-l-4 border-l-[#0a192f]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                <span>Security & Admin Audit Log</span>
              </CardTitle>
              <CardDescription>
                Immutable record of administrative actions, website overrides, and data access requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action Code</th>
                      <th className="py-3 px-4">Target Entity</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-4 text-slate-900 font-sans font-bold">
                          {log.userName} <span className="text-[10px] text-slate-400 font-mono">({log.userRole})</span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-bold">{log.action}</td>
                        <td className="py-3 px-4 text-slate-600">{log.entity}</td>
                        <td className="py-3 px-4 text-right font-sans">
                          <Badge variant="success">{log.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
