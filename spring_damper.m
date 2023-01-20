% Define the ODE function
function x_dot = spring_damper(t, x, m1, m2, k, c, l)
    % x(1) = x1, x(2) = x2, x(3) = v1, x(4) = v2
    x_dot = zeros(4,1);
    x_dot(1) = x(3); % dx1/dt = v1
    x_dot(2) = x(4); % dx2/dt = v2
    x_dot(3) = (1/m1)*(-k*((x(1)-x(2))+l)-c*x(3)); % dv1/dt = (1/m1)*(-k*(x1-x2)-c*v1)
    x_dot(4) = (1/m2)*(k*((x(1)-x(2))+l)-c*x(4)); % dv2/dt = (1/m2)*(k*(x1-x2)-c*v2)
end