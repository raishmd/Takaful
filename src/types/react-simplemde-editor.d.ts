declare module 'react-simplemde-editor' {
    import * as React from 'react';
    import { Options } from 'easymde';

    export interface SimpleMDEReactProps {
        id?: string;
        className?: string;
        style?: React.CSSProperties;
        getMdeInstance?: (instance: any) => void;
        onChange?: (value: string) => void;
        options?: Options;
        value?: string;
        placeholder?: string;
        events?: any;
        onFocus?: any;
        onBlur?: any;
    }

    const SimpleMdeReact: React.FC<SimpleMDEReactProps>;
    export default SimpleMdeReact;
}
