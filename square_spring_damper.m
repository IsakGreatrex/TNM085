% Define the ODE function
function x_dot = square_spring_damper(t, x, m, k, c, L)
    % x(1) = x1, x(2) = x2, x(3) = x3, x(4) = x4, 
    % x(5) = v1, x(6) = v2, x(7) = v3, x(8) = v4
    x_dot = zeros(8,1);
    x_dot(1) = x(5); % dx1/dt = v1
    x_dot(2) = x(6); % dx2/dt = v2
    x_dot(3) = x(7); % dx3/dt = v3
    x_dot(4) = x(8); % dx4/dt = v4
    x_dot(5) = (1/m)*(-k*(x(1)-x(2)-L) - k*(x(1)-x(3)-L) -c*x(5)); % dv1/dt
    x_dot(6) = (1/m)*(k*(x(1)-x(2)-L) - k*(x(2)-x(4)-L) -c*x(6)); % dv2/dt
    x_dot(7) = (1/m)*(k*(x(1)-x(3)-L) - k*(x(3)-x(4)-L) -c*x(7)); % dv3/dt
    x_dot(8) = (1/m)*(k*(x(2)-x(4)-L) + k*(x(3)-x(4)-L) -c*x(8)); % dv4/dt
end