import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
}

interface TabSwitcherProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
  className?: string;
  disabled?: boolean;
}

export const TabSwitcher = <T extends string>({
  options,
  activeTab,
  onTabChange,
  className,
  disabled = false,
}: TabSwitcherProps<T>) => {
  return (
    <div className={cn("mb-6 sm:mb-8 w-full flex justify-center", className)}>
      <div
        className={cn(
          // === MOBILE: GRID ===
          "grid w-full p-1 bg-[#1E1E1E] border border-[#333] rounded-xl gap-1",
          
          // === DESKTOP: FLEX ===
          // Quando a tela aumenta (sm:), ele vira flexbox inline e ajusta ao conteudo
          "sm:inline-flex sm:w-auto sm:rounded-full"
        )}
        // A Mágica do Grid no Mobile:
        // Cria colunas iguais baseado na quantidade de opções.
        // minmax(0, 1fr) é essencial: impede que textos longos estourem a largura.
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              disabled={disabled}
              onClick={() => onTabChange(item.id)}
              className={cn(
                // Layout interno
                "flex items-center justify-center gap-1.5 py-2.5 font-medium transition-all duration-300 ease-out whitespace-nowrap",
                "rounded-lg sm:rounded-full", // Quadrado no mobile, Redondo no desktop

                // Tamanho de fonte ajustado
                "text-[11px] xs:text-xs sm:text-sm px-1 sm:px-6",
                
                // Força o botão a ocupar 100% da célula do grid
                "w-full sm:w-auto", 

                isActive
                  ? "bg-neutral-100 text-neutral-950 shadow-md"
                  : "text-neutral-400 hover:text-white hover:bg-[#2a2a2a]",
                
                // Efeito de scale apenas no desktop
                isActive && "sm:transform sm:scale-[1.02]",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              // No desktop, resetamos a coluna do grid para o flex funcionar normal
              style={{ gridColumn: "auto" }}
            >
              <Icon
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};