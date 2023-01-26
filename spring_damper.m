% Define the ODE function
function dy = spring_damper(t, y)
    % Set the mass, spring constant, and damping constant
    m = 1;
    k = 10;
    c = 2;
    l = 1;
    
    x1 = y(1);
    x2 = y(2);
    v1 = y(3);
    v2 = y(4);
    
    dy = zeros(4,1);
    dy(1) = v1; % dx1/dt = v1
    dy(2) = v2; % dx2/dt = v2
    dy(3) = (1/m)*(k*((x2-x1)+l)+c*(v2-v1)); % dv1/dt = (1/m1)*(-k*(x1-x2)-c*v1)
    dy(4) = (1/m)*(-k*((x2-x1)+l)-c*(v2-v1)); % dv2/dt = (1/m2)*(k*(x1-x2)-c*v2)
end