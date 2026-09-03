"use client";

import React, { useState } from "react";
import {
  FCTAreaCouncilData,
  FCTAreaCouncilId,
  FCTFieldProject,
  FCTFieldProjectCategory,
  FCTFieldProjectStatus,
} from "@/lib/schema/ngo.schema";
import {
  MapPin,
  Plus,
  Trash2,
  Users,
  Building2,
  FolderKanban,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  X,
} from "lucide-react";

import type { NGOConfig } from "@/lib/schema/ngo.schema";

interface CouncilsProjectsTabProps {
  councils: NGOConfig["councils"];
  onChange: (updated: NGOConfig["councils"]) => void;
}

const COUNCIL_LIST: { id: FCTAreaCouncilId; name: string }[] = [
  { id: "amac", name: "AMAC (Abuja Municipal)" },
  { id: "bwari", name: "Bwari" },
  { id: "gwagwalada", name: "Gwagwalada" },
  { id: "kuje", name: "Kuje" },
  { id: "kwali", name: "Kwali" },
  { id: "abaji", name: "Abaji" },
];

const CATEGORIES: { id: FCTFieldProjectCategory; label: string }[] = [
  { id: "healthcare", label: "Healthcare & Mobile Clinics" },
  { id: "education", label: "Education & Literacy" },
  { id: "water_sanitation", label: "Water & Solar Boreholes" },
  { id: "agriculture", label: "Agriculture & Agro-Hubs" },
  { id: "idp_resilience", label: "IDP Resilience & Shelter" },
];

export const CouncilsProjectsTab: React.FC<CouncilsProjectsTabProps> = ({
  councils,
  onChange,
}) => {
  const [selectedCouncilId, setSelectedCouncilId] = useState<FCTAreaCouncilId>("amac");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<FCTFieldProject>>({
    title: "",
    category: "healthcare",
    settlementName: "",
    settlementType: "Rural Community",
    beneficiariesCount: 1000,
    status: "active",
    description: "",
  });

  const currentCouncil = councils[selectedCouncilId] || {
    id: selectedCouncilId,
    name: selectedCouncilId.toUpperCase(),
    headquarters: "Abuja",
    terrainType: "Savannah Lowland",
    populationServed: 500000,
    coordinates: { lat: 9.0765, lng: 7.3986 },
    fieldDispatchLead: {
      name: "Lead Dispatcher",
      role: "Field Coordinator",
      phone: "+2348000000000",
    },
    activeProjects: [],
  };

  const handleUpdateCouncilMeta = <K extends keyof FCTAreaCouncilData>(
    field: K,
    value: FCTAreaCouncilData[K]
  ) => {
    onChange({
      ...councils,
      [selectedCouncilId]: {
        ...currentCouncil,
        [field]: value,
      },
    });
  };

  const handleUpdateDispatchLead = (field: "name" | "role" | "phone", value: string) => {
    onChange({
      ...councils,
      [selectedCouncilId]: {
        ...currentCouncil,
        fieldDispatchLead: {
          ...currentCouncil.fieldDispatchLead,
          [field]: value,
        },
      },
    });
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = currentCouncil.activeProjects.filter((p) => p.id !== projectId);
    onChange({
      ...councils,
      [selectedCouncilId]: {
        ...currentCouncil,
        activeProjects: updatedProjects,
      },
    });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.settlementName) return;

    const created: FCTFieldProject = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      category: (newProject.category as FCTFieldProjectCategory) || "healthcare",
      settlementName: newProject.settlementName,
      settlementType: newProject.settlementType || "Community",
      beneficiariesCount: Number(newProject.beneficiariesCount) || 0,
      status: (newProject.status as FCTFieldProjectStatus) || "active",
      description: newProject.description || "",
      mediaPath: newProject.mediaPath || undefined,
    };

    onChange({
      ...councils,
      [selectedCouncilId]: {
        ...currentCouncil,
        activeProjects: [created, ...currentCouncil.activeProjects],
      },
    });

    setIsModalOpen(false);
    setNewProject({
      title: "",
      category: "healthcare",
      settlementName: "",
      settlementType: "Rural Community",
      beneficiariesCount: 1000,
      status: "active",
      description: "",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#B85D36]/10 text-[#B85D36] border border-[#B85D36]/20">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">
              FCT Area Councils & Field Projects
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Manage telemetry, dispatch leads, and field humanitarian initiatives across all 6 Abuja Area Councils.
            </p>
          </div>
        </div>
      </div>

      {/* Council Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {COUNCIL_LIST.map((c) => {
          const isSelected = selectedCouncilId === c.id;
          const projectCount = councils[c.id]?.activeProjects?.length || 0;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCouncilId(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-[#B85D36] border-[#B85D36] text-[#FAF8F5] shadow-lg shadow-[#B85D36]/20"
                  : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-[#FAF8F5] hover:border-[#3F3F46]"
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? "bg-black/20 text-white" : "bg-[#27272A] text-[#71717A]"
                }`}
              >
                {projectCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Council Metadata Card */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#B85D36]" /> {currentCouncil.name} Telemetry & Dispatch
          </span>
          <span className="text-xs font-mono text-[#71717A]">
            Lat: {currentCouncil.coordinates?.lat}, Lng: {currentCouncil.coordinates?.lng}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Headquarters</label>
            <input
              type="text"
              value={currentCouncil.headquarters}
              onChange={(e) => handleUpdateCouncilMeta("headquarters", e.target.value)}
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">Terrain Profile</label>
            <input
              type="text"
              value={currentCouncil.terrainType}
              onChange={(e) => handleUpdateCouncilMeta("terrainType", e.target.value)}
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Population Served
            </label>
            <input
              type="number"
              value={currentCouncil.populationServed}
              onChange={(e) =>
                handleUpdateCouncilMeta("populationServed", parseInt(e.target.value) || 0)
              }
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>
        </div>

        {/* Dispatch Lead */}
        <div className="bg-[#111113] border border-[#27272A] p-4 rounded-xl space-y-3">
          <span className="text-xs font-semibold uppercase text-[#A1A1AA] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#1C3F35]" /> Area Dispatch Coordinator
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-[#71717A] mb-1">Lead Name</label>
              <input
                type="text"
                value={currentCouncil.fieldDispatchLead?.name || ""}
                onChange={(e) => handleUpdateDispatchLead("name", e.target.value)}
                className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#71717A] mb-1">Operational Role</label>
              <input
                type="text"
                value={currentCouncil.fieldDispatchLead?.role || ""}
                onChange={(e) => handleUpdateDispatchLead("role", e.target.value)}
                className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#71717A] mb-1">Dispatch Phone</label>
              <input
                type="text"
                value={currentCouncil.fieldDispatchLead?.phone || ""}
                onChange={(e) => handleUpdateDispatchLead("phone", e.target.value)}
                className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#FAF8F5] font-serif">
              Active Field Initiatives ({currentCouncil.activeProjects?.length || 0})
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Humanitarian projects stationed within {currentCouncil.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A04D29] text-[#FAF8F5] shadow-lg shadow-[#B85D36]/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Field Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCouncil.activeProjects?.map((project) => (
            <div
              key={project.id}
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between hover:border-[#3F3F46] transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1C3F35]/30 text-[#4EAA86] border border-[#1C3F35]/60">
                    {project.category.replace("_", " ")}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                      project.status === "active"
                        ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/50"
                        : "bg-amber-950/40 text-amber-300 border border-amber-800/50"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#FAF8F5] group-hover:text-[#E0825B] transition-colors">
                  {project.title}
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#71717A]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B85D36]" />
                  <span>{project.settlementName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#A1A1AA]">
                    {project.beneficiariesCount.toLocaleString()} beneficiaries
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.id)}
                    title="Delete project"
                    className="text-[#71717A] hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="text-base font-bold text-[#FAF8F5] font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B85D36]" /> Add Field Project to {currentCouncil.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#71717A] hover:text-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProject.title || ""}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Solar Borehole Installation Phase 2"
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Sector Category
                  </label>
                  <select
                    value={newProject.category || "healthcare"}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        category: e.target.value as FCTFieldProjectCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Project Status
                  </label>
                  <select
                    value={newProject.status || "active"}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        status: e.target.value as FCTFieldProjectStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Settlement / Community
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.settlementName || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, settlementName: e.target.value })
                    }
                    placeholder="e.g. Pegi Settlement"
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                    Direct Beneficiaries
                  </label>
                  <input
                    type="number"
                    value={newProject.beneficiariesCount || 0}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        beneficiariesCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Field Description
                </label>
                <textarea
                  rows={3}
                  value={newProject.description || ""}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Provide scope, milestone updates, or community impact details..."
                  className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:text-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#B85D36] hover:bg-[#A04D29] text-[#FAF8F5]"
                >
                  Create Field Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
