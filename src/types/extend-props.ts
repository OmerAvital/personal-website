export type ExtendProps<
  DefaultProps extends object,
  CustomProps extends object,
  ControlledProps extends string = '',
> = Omit<DefaultProps, keyof CustomProps | ControlledProps> & CustomProps;
