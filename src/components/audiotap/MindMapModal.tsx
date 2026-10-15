"use client";

import React, { useState } from "react";
import { RecordingItem } from "@/types/recording";
import { ScrewHead } from "./ScrewHead";

interface MindMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: RecordingItem;
}

export function MindMapModal({
  isOpen,
  onClose,
  recording,
}: MindMapModalProps) {
  const [selectedNode, setSelectedNode] = useState<string>(
    "Classes & Blueprints",
  );

  if (!isOpen) return null;

  const nodes = [
    {
      id: "classes",
      title: "Classes & Blueprints",
      desc: "Abstract definition templates that bundle state attributes and operational methods together.",
      x: "20%",
      y: "30%",
    },
    {
      id: "objects",
      title: "Live Instances",
      desc: "Concrete memory allocations instantiated from classes with specific runtime values.",
      x: "75%",
      y: "28%",
    },
    {
      id: "encapsulation",
      title: "Encapsulation",
      desc: "Conceals internal state and protects invariants by restricting access exclusively through public methods.",
      x: "25%",
      y: "72%",
    },
    {
      id: "inheritance",
      title: "Inheritance",
      desc: "Hierarchical code reuse where specialized child classes inherit and extend base class functionality.",
      x: "70%",
      y: "75%",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="audiotap-panel max-w-2xl w-full rounded-[4px] p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#a89e8e]">
        {/* 4 Corner Screws */}
        <ScrewHead className="absolute top-2 left-2" rotation={25} />
        <ScrewHead className="absolute top-2 right-2" rotation={65} />
        <ScrewHead className="absolute bottom-2 left-2" rotation={45} />
        <ScrewHead className="absolute bottom-2 right-2" rotation={10} />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#baa791]">
          <div>
            <h3 className="audiotap-label text-sm text-[#22201c] font-black">
              VECTOR OSCILLOSCOPE // CONCEPTUAL MIND MAP
            </h3>
            <p className="text-xs text-[#6e685c] mt-0.5">
              Interactive topological node graph for: {recording.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6d6657] hover:text-black text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Vector Radar Screen */}
        <div className="my-4 h-64 rounded bg-[#0c0f12] border border-[#2b3038] relative overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)]">
          {/* Radar Grid Lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle, #f59e0b 1px, transparent 1px), linear-gradient(to right, #38342a 1px, transparent 1px), linear-gradient(to bottom, #38342a 1px, transparent 1px)",
              backgroundSize: "32px 32px, 32px 32px, 32px 32px",
            }}
          />

          {/* Center Root Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-[2px] bg-[#221f18] border border-[#e5a93c] text-[#f59e0b] font-mono text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)] z-20">
            {recording.course}
          </div>

          {/* SVG Vector Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1="50%"
              y1="50%"
              x2="28%"
              y2="35%"
              stroke="#e5a93c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <line
              x1="50%"
              y1="50%"
              x2="72%"
              y2="33%"
              stroke="#e5a93c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <line
              x1="50%"
              y1="50%"
              x2="32%"
              y2="72%"
              stroke="#e5a93c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <line
              x1="50%"
              y1="50%"
              x2="68%"
              y2="73%"
              stroke="#e5a93c"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          </svg>

          {/* Concept Satellite Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.title;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.title)}
                className={`absolute px-3 py-1.5 rounded-[2px] cursor-pointer transition-all font-mono text-[11px] font-bold z-20 ${
                  isSelected
                    ? "bg-[#e5a93c] text-[#121417] shadow-[0_0_10px_#e5a93c] scale-105"
                    : "bg-[#181c22] text-[#d6d0c4] border border-[#3b424e] hover:border-[#e5a93c]"
                }`}
                style={{
                  top: node.y,
                  left: node.x,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {node.title}
              </div>
            );
          })}
        </div>

        {/* Node Definition Detail Bar */}
        <div className="p-3 rounded bg-[#eae4d7] border border-[#b8af9e] text-xs font-mono">
          <span className="font-bold text-[#1f1d1a] block mb-0.5">
            NODE INSPECTION // {selectedNode}
          </span>
          <p className="text-[#554f42]">
            {nodes.find((n) => n.title === selectedNode)?.desc ||
              "Select any node on the vector oscilloscope to inspect conceptual domain relations."}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#baa791] mt-3">
          <span className="text-[10px] text-[#6e685c] font-mono">
            Vector Topology: 4 Nodes Linked // Live Graph
          </span>
          <button
            type="button"
            onClick={onClose}
            className="audiotap-btn-tactile px-4 py-2 rounded-[3px] text-xs font-bold text-[#1a1815]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
