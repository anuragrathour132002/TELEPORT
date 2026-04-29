declare module "react-window" {
  import * as React from "react";

  export interface ListChildComponentProps<T = unknown> {
    index: number;
    style: React.CSSProperties;
    data: T;
    isScrolling?: boolean;
  }

  export interface FixedSizeListProps<T = unknown> {
    children: React.ComponentType<ListChildComponentProps<T>>;
    height: number;
    itemCount: number;
    itemData?: T;
    itemSize: number;
    overscanCount?: number;
    width: number | string;
  }

  export class FixedSizeList<T = unknown> extends React.Component<
    FixedSizeListProps<T>
  > {}
}
