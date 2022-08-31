import { createContext, useContext } from "react";
import type { FC, ReactNode } from "react";
import { parse } from "papaparse";
import { csvParser } from "./parser";

const dependencies = {
    parseStrongCSV: csvParser(parse)
};
const DependencyContext = createContext<typeof dependencies | undefined>(undefined);

// Dependency provider
// https://stackoverflow.com/a/57253387
export const DependencyProvider: FC<{ children: ReactNode }> = ({ children }) => (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
);

// Dependency consumer
// https://kentcdodds.com/blog/how-to-use-react-context-effectively#typescript
export const useDependency = () => {
    const dependencies = useContext(DependencyContext);
    if (dependencies === undefined) {
        throw new Error('Dependencies are not given');
    }
    return dependencies;
};

